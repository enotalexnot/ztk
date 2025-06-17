# Руководство администратора TechCenter

## Управление приложением

### Основные команды
```bash
# Управление приложением
techcenter start     # Запуск
techcenter stop      # Остановка
techcenter restart   # Перезапуск
techcenter status    # Статус
techcenter logs      # Просмотр логов
techcenter update    # Обновление

# Прямые команды PM2
sudo -u techcenter pm2 status
sudo -u techcenter pm2 logs techcenter
sudo -u techcenter pm2 restart techcenter
sudo -u techcenter pm2 stop techcenter
```

## Мониторинг системы

### Проверка состояния сервисов
```bash
# Статус всех сервисов
systemctl status nginx postgresql
sudo -u techcenter pm2 status

# Проверка портов
netstat -tlnp | grep :80
netstat -tlnp | grep :443
netstat -tlnp | grep :5000
netstat -tlnp | grep :5432
```

### Мониторинг ресурсов
```bash
# Использование CPU и памяти
htop
top

# Использование диска
df -h
du -sh /home/techcenter/app/
du -sh /var/log/

# Память
free -h
```

### Просмотр логов
```bash
# Логи приложения
tail -f /home/techcenter/logs/combined.log
tail -f /home/techcenter/logs/err.log

# Логи Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Системные логи
journalctl -u nginx -f
journalctl -u postgresql -f
```

## Управление базой данных

### Подключение к БД
```bash
# Получение пароля из конфигурации
cat /home/techcenter/deployment-info.txt | grep "Пароль БД"

# Подключение к PostgreSQL
sudo -u postgres psql techcenter
# или с пользователем приложения
psql postgresql://techuser:PASSWORD@localhost:5432/techcenter
```

### Резервное копирование
```bash
# Создание бэкапа
sudo -u postgres pg_dump techcenter > /home/backups/manual_backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
sudo -u postgres psql techcenter < /home/backups/backup_file.sql

# Список автоматических бэкапов
ls -la /home/backups/
```

### Миграции базы данных
```bash
# Применение новых миграций
sudo -u techcenter bash -c "cd /home/techcenter/app && npx drizzle-kit push"

# Создание новой миграции
sudo -u techcenter bash -c "cd /home/techcenter/app && npx drizzle-kit generate"
```

## Обновление приложения

### Автоматическое обновление
```bash
techcenter update
```

### Ручное обновление
```bash
# 1. Остановка приложения
techcenter stop

# 2. Резервное копирование
sudo -u postgres pg_dump techcenter > /home/backups/before_update_$(date +%Y%m%d_%H%M%S).sql

# 3. Обновление кода (git, scp, rsync)
cd /home/techcenter/app
# git pull или копирование новых файлов

# 4. Установка зависимостей
sudo -u techcenter npm install

# 5. Применение миграций
sudo -u techcenter npx drizzle-kit push

# 6. Запуск приложения
techcenter start
```

## Настройка Nginx

### Основные файлы конфигурации
```bash
# Конфигурация сайта
/etc/nginx/sites-available/techcenter

# Основная конфигурация Nginx
/etc/nginx/nginx.conf

# Проверка конфигурации
nginx -t

# Перезагрузка конфигурации
systemctl reload nginx
```

### Добавление нового домена
```bash
# Редактирование конфигурации
nano /etc/nginx/sites-available/techcenter

# Изменить строку server_name
server_name example.com www.example.com;

# Проверка и перезагрузка
nginx -t && systemctl reload nginx
```

## SSL сертификаты

### Установка SSL для домена
```bash
./setup-ssl.sh your-domain.com
```

### Проверка статуса сертификата
```bash
certbot certificates
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout
```

### Обновление сертификата
```bash
# Ручное обновление
certbot renew

# Тест обновления
certbot renew --dry-run
```

## Безопасность

### Обновление системы
```bash
# Обновление пакетов
apt update && apt upgrade -y

# Проверка перезагрузки
cat /var/run/reboot-required
```

### Управление firewall
```bash
# Статус UFW
ufw status verbose

# Разрешить новый порт
ufw allow 8080

# Заблокировать IP
ufw deny from 192.168.1.100
```

### Мониторинг fail2ban
```bash
# Статус fail2ban
fail2ban-client status

# Заблокированные IP
fail2ban-client status sshd
```

## Производительность

### Оптимизация PostgreSQL
```bash
# Конфигурация PostgreSQL
nano /etc/postgresql/*/main/postgresql.conf

# Рекомендуемые настройки для небольшого сервера:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# maintenance_work_mem = 128MB

# Перезапуск после изменений
systemctl restart postgresql
```

### Оптимизация Nginx
```bash
# Включение кэширования в /etc/nginx/sites-available/techcenter
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Мониторинг и алерты

### Настройка логротации
```bash
# Конфигурация logrotate для приложения
cat > /etc/logrotate.d/techcenter << 'EOF'
/home/techcenter/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 techcenter techcenter
    postrotate
        sudo -u techcenter pm2 reloadLogs
    endscript
}
EOF
```

### Мониторинг дискового пространства
```bash
# Создание скрипта проверки места
cat > /usr/local/bin/check-disk-space.sh << 'EOF'
#!/bin/bash
THRESHOLD=90
CURRENT=$(df / | grep / | awk '{ print $5}' | sed 's/%//g')
if [ "$CURRENT" -gt "$THRESHOLD" ]; then
    echo "ВНИМАНИЕ: Диск заполнен на ${CURRENT}%"
    # Отправка уведомления или email
fi
EOF

chmod +x /usr/local/bin/check-disk-space.sh

# Добавление в cron
echo "0 */6 * * * /usr/local/bin/check-disk-space.sh" | crontab -
```

## Диагностика проблем

### Приложение не запускается
```bash
# Проверка логов ошибок
tail -50 /home/techcenter/logs/err.log

# Проверка конфигурации
sudo -u techcenter bash -c "cd /home/techcenter/app && npm run check" 2>/dev/null || echo "Нет команды check"

# Проверка переменных окружения
sudo -u techcenter bash -c "cd /home/techcenter/app && node -e 'console.log(process.env.DATABASE_URL)'"
```

### База данных недоступна
```bash
# Проверка статуса PostgreSQL
systemctl status postgresql

# Проверка подключения
sudo -u postgres psql -c "\l"

# Проверка свободного места
df -h /var/lib/postgresql/
```

### Nginx не работает
```bash
# Проверка конфигурации
nginx -t

# Проверка портов
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Проверка логов
tail -20 /var/log/nginx/error.log
```

## Полезные алиасы

Добавьте в `/root/.bashrc`:
```bash
alias tc-status='techcenter status'
alias tc-logs='techcenter logs'
alias tc-restart='techcenter restart'
alias nginx-reload='nginx -t && systemctl reload nginx'
alias check-services='systemctl status nginx postgresql && sudo -u techcenter pm2 status'
```

## Контакты для поддержки

В случае серьезных проблем сохраните следующую диагностическую информацию:

```bash
# Создание диагностического отчета
cat > /tmp/diagnostic-report.txt << EOF
=== Диагностический отчет $(date) ===

Статус сервисов:
$(systemctl status nginx postgresql --no-pager)

PM2 статус:
$(sudo -u techcenter pm2 status)

Использование ресурсов:
$(free -h)
$(df -h)

Последние ошибки в логах:
$(tail -20 /home/techcenter/logs/err.log)
$(tail -20 /var/log/nginx/error.log)

Конфигурация Nginx:
$(nginx -T)

EOF

echo "Диагностический отчет создан: /tmp/diagnostic-report.txt"
```