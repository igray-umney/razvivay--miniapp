# Развивайка - Telegram Mini App

Приложение для развития детей 1-7 лет с активностями и напоминаниями.

## 🚀 Функции

- 🎮 Развивающие активности по возрастам
- 🔔 Уведомления через Telegram Bot
- 📊 Отслеживание прогресса развития
- 👑 Премиум подписка с расширенными возможностями
- 📱 Полная интеграция с Telegram

## 🛠️ Технологии

- **Frontend**: React + Vite
- **Backend**: Vercel API Functions
- **Bot**: Telegram Bot API
- **Платежи**: Telegram Payments
- **Хостинг**: Vercel

## 🔧 Установка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/username/razvivayка-miniapp.git
cd razvivayка-miniapp
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте переменные окружения:**
```bash
# В Vercel Dashboard добавьте:
TELEGRAM_BOT_TOKEN=your_bot_token
MINI_APP_URL=https://your-app.vercel.app
```

4. **Запустите локально:**
```bash
npm run dev
```

## 📱 Настройка Telegram Bot

1. Создайте бота через @BotFather
2. Получите токен бота
3. Настройте мини-приложение:
   ```
   /newapp
   - Выберите бота
   - Название: Развивайка
   - Описание: Приложение для развития детей
   - URL: https://your-app.vercel.app
   ```

## 🚀 Деплой

```bash
# Коммит и пуш
git add .
git commit -m "Initial commit"
git push origin main

# Деплой на Vercel
vercel --prod
```

## 📚 API Endpoints

- `POST /api/telegram/connect` - Подключение пользователя к боту
- `POST /api/telegram/send-notification` - Отправка уведомления
- `POST /api/telegram/create-invoice` - Создание счета для оплаты
- `GET /api/status` - Статус API

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Сделайте коммит изменений
4. Создайте Pull Request

## 📄 Лицензия

MIT License
