#!/bin/bash

# Автоматический скрипт развертывания для Ubuntu 24 Server
# Использование: chmod +x deploy.sh && sudo ./deploy.sh

set -e

echo "🚀 Начинаем развертывание приложения TechCenter..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка прав root
if [[ $EUID -ne 0 ]]; then
   print_error "Этот скрипт должен запускаться с правами root (используйте sudo)"
   exit 1
fi

print_status "Обновляем систему..."
apt update && apt upgrade -y

print_status "Устанавливаем базовые пакеты..."
apt install -y curl wget git unzip software-properties-common nginx ufw

print_status "Настраиваем firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'

print_status "Устанавливаем Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

print_status "Устанавливаем PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

print_status "Устанавливаем PM2..."
npm install -g pm2

print_status "Создаем пользователя приложения..."
if ! id "techcenter" &>/dev/null; then
    useradd -m -s /bin/bash techcenter
    usermod -aG sudo techcenter
fi

print_status "Создаем директории..."
mkdir -p /home/techcenter/app
mkdir -p /home/techcenter/logs
mkdir -p /home/backups
chown -R techcenter:techcenter /home/techcenter

print_status "Настраиваем базу данных..."
# Генерируем случайный пароль
DB_PASSWORD=$(openssl rand -base64 32)

sudo -u postgres psql -c "DROP DATABASE IF EXISTS techcenter;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS techuser;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE techcenter;" 
sudo -u postgres psql -c "CREATE USER techuser WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE techcenter TO techuser;"
sudo -u postgres psql -c "ALTER USER techuser CREATEDB;"

print_status "Создаем файл переменных окружения..."
SESSION_SECRET=$(openssl rand -base64 64)
cat > /home/techcenter/app/.env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://techuser:$DB_PASSWORD@localhost:5432/techcenter
SESSION_SECRET=$SESSION_SECRET
EOF

chown techcenter:techcenter /home/techcenter/app/.env
chmod 600 /home/techcenter/app/.env

print_status "Создаем конфигурацию PM2..."
cat > /home/techcenter/app/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'techcenter',
    script: 'tsx',
    args: 'server/index.ts',
    cwd: '/home/techcenter/app',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/techcenter/logs/err.log',
    out_file: '/home/techcenter/logs/out.log',
    log_file: '/home/techcenter/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    restart_delay: 1000
  }]
}
EOF

chown techcenter:techcenter /home/techcenter/app/ecosystem.config.js

print_status "Настраиваем Nginx..."
cat > /etc/nginx/sites-available/techcenter << 'EOF'
server {
    listen 80;
    server_name _;
    
    client_max_body_size 50M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Static files
    location /uploads {
        alias /home/techcenter/app/uploads;
        expires 30d;
        add_header Cache-Control "public";
        try_files $uri =404;
    }

    location /assets {
        alias /home/techcenter/app/dist/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Main application
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Активируем конфигурацию
ln -sf /etc/nginx/sites-available/techcenter /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
nginx -t
systemctl restart nginx

print_status "Настраиваем резервное копирование..."
cat > /etc/cron.d/techcenter-backup << EOF
# Backup database daily at 2 AM
0 2 * * * postgres pg_dump techcenter > /home/backups/techcenter_\$(date +\\%Y\\%m\\%d).sql
# Clean old backups (keep 7 days)
0 3 * * * find /home/backups -name "techcenter_*.sql" -mtime +7 -delete
EOF

print_status "Настраиваем автозапуск PM2..."
sudo -u techcenter bash -c "
cd /home/techcenter/app
pm2 startup | tail -1 > /tmp/pm2-startup.sh 2>/dev/null || true
"

if [ -f /tmp/pm2-startup.sh ]; then
    bash /tmp/pm2-startup.sh
    rm /tmp/pm2-startup.sh
fi

print_status "Устанавливаем fail2ban для безопасности..."
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

print_status "Настраиваем автообновления безопасности..."
apt install -y unattended-upgrades
echo 'Unattended-Upgrade::Automatic-Reboot "false";' > /etc/apt/apt.conf.d/51unattended-upgrades-local

print_status "Создаем скрипт управления приложением..."
cat > /usr/local/bin/techcenter << 'EOF'
#!/bin/bash

case "$1" in
    start)
        sudo -u techcenter bash -c "cd /home/techcenter/app && pm2 start ecosystem.config.js"
        ;;
    stop)
        sudo -u techcenter bash -c "cd /home/techcenter/app && pm2 stop techcenter"
        ;;
    restart)
        sudo -u techcenter bash -c "cd /home/techcenter/app && pm2 restart techcenter"
        ;;
    status)
        sudo -u techcenter bash -c "pm2 status"
        ;;
    logs)
        sudo -u techcenter bash -c "pm2 logs techcenter"
        ;;
    update)
        echo "Останавливаем приложение..."
        sudo -u techcenter bash -c "cd /home/techcenter/app && pm2 stop techcenter"
        echo "Обновляем зависимости..."
        sudo -u techcenter bash -c "cd /home/techcenter/app && npm install"
        echo "Применяем миграции..."
        sudo -u techcenter bash -c "cd /home/techcenter/app && npx drizzle-kit push"
        echo "Запускаем приложение..."
        sudo -u techcenter bash -c "cd /home/techcenter/app && pm2 start ecosystem.config.js"
        ;;
    *)
        echo "Использование: $0 {start|stop|restart|status|logs|update}"
        exit 1
        ;;
esac
EOF

chmod +x /usr/local/bin/techcenter

print_status "Сохраняем информацию о развертывании..."
cat > /home/techcenter/deployment-info.txt << EOF
=== TechCenter Deployment Info ===
Дата развертывания: $(date)
Пользователь приложения: techcenter
Директория приложения: /home/techcenter/app
База данных: PostgreSQL
Пользователь БД: techuser
Пароль БД: $DB_PASSWORD
Веб-сервер: Nginx
Менеджер процессов: PM2

=== Полезные команды ===
Управление приложением: techcenter {start|stop|restart|status|logs|update}
Просмотр логов Nginx: tail -f /var/log/nginx/access.log
Подключение к БД: psql postgresql://techuser:$DB_PASSWORD@localhost:5432/techcenter

=== Следующие шаги ===
1. Скопируйте файлы проекта в /home/techcenter/app/
2. Установите зависимости: sudo -u techcenter bash -c "cd /home/techcenter/app && npm install"
3. Создайте таблицы: sudo -u techcenter bash -c "cd /home/techcenter/app && npx drizzle-kit push"
4. Запустите приложение: techcenter start
EOF

chown techcenter:techcenter /home/techcenter/deployment-info.txt

echo ""
print_status "✅ Развертывание завершено успешно!"
echo ""
echo "📋 Информация о развертывании сохранена в /home/techcenter/deployment-info.txt"
echo ""
echo "🔑 Пароль базы данных: $DB_PASSWORD"
echo ""
echo "📝 Следующие шаги:"
echo "1. Скопируйте файлы проекта в /home/techcenter/app/"
echo "2. Выполните: sudo -u techcenter bash -c 'cd /home/techcenter/app && npm install'"
echo "3. Выполните: sudo -u techcenter bash -c 'cd /home/techcenter/app && npx drizzle-kit push'"
echo "4. Запустите приложение: techcenter start"
echo ""
echo "🌐 После запуска приложение будет доступно по адресу: http://$(curl -s ifconfig.me)"
echo ""