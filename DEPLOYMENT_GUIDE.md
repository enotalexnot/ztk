# Руководство по развертыванию на Ubuntu 24 Server

## 1. Подготовка сервера

### Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### Установка необходимых пакетов
```bash
# Основные утилиты
sudo apt install -y curl wget git unzip software-properties-common

# Nginx для проксирования
sudo apt install -y nginx

# Firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

## 2. Установка Node.js 20

```bash
# Добавляем репозиторий NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Устанавливаем Node.js
sudo apt install -y nodejs

# Проверяем версию
node --version
npm --version
```

## 3. Установка PostgreSQL

```bash
# Устанавливаем PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Запускаем службу
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создаем базу данных и пользователя
sudo -u postgres psql -c "CREATE DATABASE techcenter;"
sudo -u postgres psql -c "CREATE USER techuser WITH PASSWORD 'secure_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE techcenter TO techuser;"
sudo -u postgres psql -c "ALTER USER techuser CREATEDB;"
```

## 4. Установка PM2 для управления процессами

```bash
sudo npm install -g pm2
```

## 5. Подготовка приложения

### Создание пользователя для приложения
```bash
sudo useradd -m -s /bin/bash techcenter
sudo usermod -aG sudo techcenter
```

### Переключение на пользователя приложения
```bash
sudo su - techcenter
```

### Клонирование и настройка проекта
```bash
# Создаем директорию для приложения
mkdir -p /home/techcenter/app
cd /home/techcenter/app

# Копируем файлы проекта (замените на ваш способ доставки кода)
# Можно использовать git clone, scp, rsync и т.д.
```

## 6. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://techuser:secure_password_here@localhost:5432/techcenter
SESSION_SECRET=your_very_long_random_session_secret_here
EOF
```

## 7. Установка зависимостей и сборка

```bash
# Установка зависимостей
npm install

# Создание таблиц в базе данных
npx drizzle-kit push

# Сборка frontend (если необходимо)
npm run build
```

## 8. Настройка PM2

Создайте файл `ecosystem.config.js`:

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'techcenter',
    script: 'tsx',
    args: 'server/index.ts',
    cwd: '/home/techcenter/app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/techcenter/logs/err.log',
    out_file: '/home/techcenter/logs/out.log',
    log_file: '/home/techcenter/logs/combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
}
EOF
```

### Создание директории для логов
```bash
mkdir -p /home/techcenter/logs
```

### Запуск приложения через PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 9. Настройка Nginx

Выйдите из пользователя techcenter и создайте конфигурацию Nginx:

```bash
exit  # возвращаемся к root/sudo пользователю

sudo cat > /etc/nginx/sites-available/techcenter << 'EOF'
server {
    listen 80;
    server_name ваш_домен_или_IP;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Статические файлы
    location /assets {
        alias /home/techcenter/app/dist/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /home/techcenter/app/uploads;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API и основное приложение
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Размер загружаемых файлов
    client_max_body_size 50M;
}
EOF
```

### Активация конфигурации Nginx
```bash
sudo ln -s /etc/nginx/sites-available/techcenter /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # удаляем дефолтную конфигурацию
sudo nginx -t  # проверяем конфигурацию
sudo systemctl restart nginx
```

## 10. Настройка SSL с Let's Encrypt (опционально)

```bash
# Устанавливаем Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получаем SSL сертификат (замените на ваш домен)
sudo certbot --nginx -d ваш_домен.com

# Автообновление сертификата
sudo crontab -e
# Добавьте строку:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 11. Мониторинг и логи

### Просмотр логов приложения
```bash
sudo su - techcenter
pm2 logs techcenter
```

### Просмотр логов Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Статус сервисов
```bash
sudo systemctl status nginx
sudo systemctl status postgresql
sudo su - techcenter -c "pm2 status"
```

## 12. Заполнение базы данных

После развертывания подключитесь к базе данных и выполните SQL-скрипты для создания начальных данных:

```bash
sudo su - techcenter
cd /home/techcenter/app
npx drizzle-kit push  # создание таблиц

# Если у вас есть SQL-файл с данными:
# psql postgresql://techuser:secure_password_here@localhost:5432/techcenter < your_data.sql
```

## 13. Резервное копирование

Настройте автоматическое резервное копирование базы данных:

```bash
sudo crontab -e
# Добавьте строку для ежедневного бэкапа в 2:00:
# 0 2 * * * sudo -u postgres pg_dump techcenter > /home/backups/techcenter_$(date +\%Y\%m\%d).sql
```

## 14. Обновление приложения

Для обновления приложения:

```bash
sudo su - techcenter
cd /home/techcenter/app

# Остановка приложения
pm2 stop techcenter

# Обновление кода (git pull, scp новых файлов и т.д.)
git pull  # или другой способ обновления

# Установка новых зависимостей
npm install

# Применение миграций БД (если есть)
npx drizzle-kit push

# Перезапуск приложения
pm2 restart techcenter
```

## Безопасность

1. **Обновите пароли**: Замените все пароли по умолчанию на сильные
2. **Настройте fail2ban**: `sudo apt install fail2ban`
3. **Настройте автообновления безопасности**: `sudo apt install unattended-upgrades`
4. **Закройте неиспользуемые порты**: Используйте `sudo ufw status` для проверки
5. **Регулярно обновляйте систему**: `sudo apt update && sudo apt upgrade`

## Полезные команды

```bash
# Перезапуск всех сервисов
sudo systemctl restart nginx postgresql
sudo su - techcenter -c "pm2 restart all"

# Проверка портов
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5000

# Проверка использования ресурсов
htop
df -h
free -h
```

Это руководство поможет вам развернуть приложение на чистом сервере Ubuntu 24. После выполнения всех шагов ваше приложение будет доступно по IP-адресу сервера или домену.