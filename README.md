# TechCenter - Сайт технического центра

Полноценный веб-сайт технического центра с админ-панелью для управления контентом, каталогом товаров, новостями и статьями.

## Возможности

- 🏪 Каталог товаров с категориями и подкатегориями
- 📰 Система управления новостями и статьями
- 🎨 Настраиваемые элементы интерфейса (слайдер, меню)
- 👥 Управление партнерами
- 📝 Статические страницы
- 💼 Админ-панель для управления контентом
- 📱 Адаптивный дизайн
- 🔐 Безопасная аутентификация
- 📊 Система обратной связи

## Технологии

**Frontend:**
- React + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- Wouter (роутинг)
- React Hook Form + Zod

**Backend:**
- Node.js + Express
- PostgreSQL + Drizzle ORM
- TypeScript
- Multer (загрузка файлов)
- Сессии с PostgreSQL

## Быстрый старт

### Локальная разработка

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Настройте базу данных PostgreSQL
4. Создайте файл `.env` по примеру `.env.example`
5. Примените миграции: `npx drizzle-kit push`
6. Запустите сервер: `npm run dev`

### Развертывание на VDS

#### Автоматическое развертывание

Для автоматической настройки чистого сервера Ubuntu 24:

```bash
# Скопируйте deploy.sh на сервер
scp deploy.sh root@your-server-ip:/tmp/

# Выполните на сервере
ssh root@your-server-ip
chmod +x /tmp/deploy.sh
/tmp/deploy.sh
```

#### Развертывание файлов проекта

После настройки сервера:

```bash
# Локально
./quick-deploy.sh your-server-ip [your-domain.com]
```

#### Настройка SSL

```bash
# На сервере
./setup-ssl.sh your-domain.com
```

## Структура проекта

```
├── client/               # Frontend React приложение
│   ├── src/
│   │   ├── components/   # Компоненты UI
│   │   ├── pages/        # Страницы приложения
│   │   └── lib/          # Утилиты и хуки
├── server/               # Backend Express сервер
│   ├── routes.ts         # API маршруты
│   ├── storage.ts        # Слой работы с БД
│   └── auth.ts           # Аутентификация
├── shared/               # Общие типы и схемы
│   └── schema.ts         # Схемы Drizzle + Zod
└── uploads/              # Загруженные файлы
```

## Админ-панель

Доступ к админ-панели: `/admin`

**Возможности:**
- Управление товарами и категориями
- Редактирование новостей и статей
- Настройка слайдера и меню
- Управление партнерами
- Редактирование статических страниц
- Настройки сайта

**Дефолтные учетные данные:**
- Логин: `admin`
- Пароль: `admin123`

## API Endpoints

```
GET    /api/products           # Список товаров
GET    /api/categories         # Категории
GET    /api/news              # Новости
GET    /api/articles          # Статьи
GET    /api/partners          # Партнеры
GET    /api/slider-items      # Элементы слайдера
POST   /api/inquiries         # Отправка запроса

# Админ API (требует авторизации)
POST   /api/admin/login       # Вход в админку
POST   /api/admin/logout      # Выход
GET    /api/admin/check       # Проверка авторизации
```

## Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/database
SESSION_SECRET=your_session_secret
```

## Развертывание

### Файлы для развертывания

- `deploy.sh` - Автоматическая настройка сервера
- `quick-deploy.sh` - Быстрое развертывание проекта
- `setup-ssl.sh` - Настройка SSL сертификата
- `DEPLOYMENT_GUIDE.md` - Подробное руководство
- `ADMIN_GUIDE.md` - Руководство администратора

### Управление на сервере

После развертывания доступны команды:

```bash
techcenter start     # Запуск
techcenter stop      # Остановка
techcenter restart   # Перезапуск
techcenter status    # Статус
techcenter logs      # Логи
techcenter update    # Обновление
```

## Безопасность

- Хеширование паролей с bcrypt
- Защита от CSRF
- Валидация данных с Zod
- Настроенные заголовки безопасности
- Автоматические бэкапы БД
- Fail2ban для защиты от брутфорса

## Производительность

- Gzip сжатие
- Кэширование статических файлов
- Оптимизированные SQL запросы
- Cluster mode для PM2
- CDN ready структура

## Поддержка

Для диагностики проблем используйте:

```bash
# Проверка всех сервисов
systemctl status nginx postgresql
sudo -u techcenter pm2 status

# Просмотр логов
tail -f /home/techcenter/logs/combined.log
tail -f /var/log/nginx/error.log
```

## Лицензия

MIT License