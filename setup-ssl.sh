#!/bin/bash

# Скрипт для настройки SSL сертификата с Let's Encrypt
# Использование: ./setup-ssl.sh your-domain.com

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Использование: $0 <domain>"
    echo "Пример: $0 example.com"
    exit 1
fi

echo "🔒 Настройка SSL сертификата для домена $DOMAIN"

# Проверяем, что домен указывает на этот сервер
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo "⚠️  Предупреждение: Домен $DOMAIN не указывает на этот сервер"
    echo "   IP сервера: $SERVER_IP"
    echo "   IP домена: $DOMAIN_IP"
    echo "   Продолжить? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        exit 1
    fi
fi

# Обновляем конфигурацию Nginx с правильным доменом
echo "📝 Обновляем конфигурацию Nginx..."
sed -i "s/server_name _;/server_name $DOMAIN;/" /etc/nginx/sites-available/techcenter
nginx -t && systemctl reload nginx

# Устанавливаем Certbot если не установлен
if ! command -v certbot &> /dev/null; then
    echo "📦 Устанавливаем Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Получаем SSL сертификат
echo "🔐 Получаем SSL сертификат..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Проверяем статус сертификата
if certbot certificates | grep -q "$DOMAIN"; then
    echo "✅ SSL сертификат успешно установлен для $DOMAIN"
    
    # Настраиваем автообновление
    echo "⚙️  Настраиваем автообновление сертификата..."
    if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | crontab -
        echo "✅ Автообновление настроено"
    fi
    
    # Тестируем автообновление
    echo "🧪 Тестируем процесс обновления..."
    certbot renew --dry-run
    
    echo ""
    echo "🎉 SSL сертификат настроен успешно!"
    echo "🌐 Сайт доступен по адресу: https://$DOMAIN"
    echo "🔒 Сертификат будет автоматически обновляться"
    echo ""
    
    # Обновляем security headers для HTTPS
    cat >> /etc/nginx/sites-available/techcenter << 'EOF'

# Additional security for HTTPS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
EOF
    
    nginx -t && systemctl reload nginx
    
else
    echo "❌ Не удалось получить SSL сертификат"
    echo "Проверьте:"
    echo "1. Домен корректно настроен и указывает на этот сервер"
    echo "2. Порты 80 и 443 открыты"
    echo "3. Nginx запущен и отвечает"
    exit 1
fi