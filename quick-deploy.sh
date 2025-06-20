#!/bin/bash

# Быстрый скрипт для развертывания файлов проекта на уже настроенном сервере
# Использование: ./quick-deploy.sh [server_ip] [optional_domain]

set -e

SERVER_IP=$1
DOMAIN=$2

if [ -z "$SERVER_IP" ]; then
    echo "Использование: $0 <server_ip> [domain]"
    echo "Пример: $0 192.168.1.100"
    echo "Пример: $0 192.168.1.100 example.com"
    exit 1
fi

echo "🚀 Развертывание проекта на сервер $SERVER_IP"

# Проверяем подключение к серверу
if ! ping -c 1 "$SERVER_IP" > /dev/null 2>&1; then
    echo "❌ Не удается подключиться к серверу $SERVER_IP"
    exit 1
fi

echo "📦 Создаем архив проекта..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='uploads' \
    --exclude='*.log' \
    --exclude='.env' \
    -czf project.tar.gz .

echo "📤 Копируем файлы на сервер..."
scp project.tar.gz root@$SERVER_IP:/tmp/

echo "🔧 Развертывание на сервере..."
ssh root@$SERVER_IP << 'ENDSSH'
    cd /tmp
    tar -xzf project.tar.gz -C /home/techcenter/app/
    chown -R techcenter:techcenter /home/techcenter/app/
    rm project.tar.gz
    
    echo "📦 Устанавливаем зависимости..."
    sudo -u techcenter bash -c "cd /home/techcenter/app && npm install"
    
    echo "🗄️ Создаем таблицы в БД..."
    sudo -u techcenter bash -c "cd /home/techcenter/app && npx drizzle-kit push"
    
    echo "📝 Добавляем начальные данные..."
    sudo -u techcenter bash -c "cd /home/techcenter/app && npm run seed" 2>/dev/null || echo "Скрипт seed не найден, пропускаем..."
    
    echo "🚀 Запускаем приложение..."
    sudo -u techcenter bash -c "cd /home/techcenter/app && pm2 start ecosystem.config.js"
    sudo -u techcenter bash -c "pm2 save"
    
    echo "✅ Развертывание завершено!"
    echo "🌐 Приложение доступно по адресу: http://$(curl -s ifconfig.me)"
ENDSSH

# Обновляем домен в Nginx если указан
if [ ! -z "$DOMAIN" ]; then
    echo "🌐 Настраиваем домен $DOMAIN..."
    ssh root@$SERVER_IP << ENDSSH
        sed -i "s/server_name _;/server_name $DOMAIN;/" /etc/nginx/sites-available/techcenter
        nginx -t && systemctl reload nginx
        echo "✅ Домен $DOMAIN настроен"
ENDSSH
fi

# Очищаем временные файлы
rm -f project.tar.gz

echo ""
echo "🎉 Развертывание успешно завершено!"
echo "🌐 Сайт доступен по адресу: http://$SERVER_IP"
if [ ! -z "$DOMAIN" ]; then
    echo "🌐 Или по домену: http://$DOMAIN"
fi
echo ""
echo "📋 Полезные команды для управления:"
echo "ssh root@$SERVER_IP 'techcenter status'  # Статус приложения"
echo "ssh root@$SERVER_IP 'techcenter logs'    # Просмотр логов"
echo "ssh root@$SERVER_IP 'techcenter restart' # Перезапуск"
echo ""