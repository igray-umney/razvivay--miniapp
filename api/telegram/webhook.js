// api/telegram/webhook.js
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, ...data } = req.body;
    
    console.log('Webhook action:', action, data);
    
    switch (action) {
      case 'connect':
        await handleConnect(data);
        break;
      case 'send_notification':
        await handleSendNotification(data);
        break;
      case 'create_invoice':
        const result = await handleCreateInvoice(data);
        return res.json(result);
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function handleConnect({ userId, username, firstName, settings }) {
  const message = `Привет, ${firstName}! 🎉

Теперь я буду напоминать тебе о занятиях с малышом. Развиваемся вместе! 🚀

Настройки уведомлений:
⏰ Время: ${settings.time}
📅 Частота: ${settings.frequency === 'daily' ? 'Ежедневно' : 'Другая'}
🔔 Тип: ${settings.reminderType === 'motivational' ? 'Мотивирующие' : 'Простые'}`;
  
  await bot.sendMessage(userId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎮 Открыть приложение',
            web_app: {
              url: process.env.MINI_APP_URL || 'https://your-app.vercel.app'
            }
          }
        ]
      ]
    }
  });
}

async function handleSendNotification({ userId, message }) {
  await bot.sendMessage(userId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🎮 Выбрать активность',
            web_app: {
              url: process.env.MINI_APP_URL || 'https://your-app.vercel.app'
            }
          }
        ]
      ]
    }
  });
}

async function handleCreateInvoice({ userId, amount, description }) {
  // Примечание: для реальных платежей нужно настроить провайдера
  try {
    const invoice = await bot.createInvoiceLink({
      title: 'Премиум подписка Развивайка',
      description: description,
      payload: `premium_${userId}_${Date.now()}`,
      currency: 'RUB',
      prices: [{ 
        label: 'Премиум подписка', 
        amount: amount * 100 // в копейках
      }]
    });
    
    return { success: true, invoiceUrl: invoice };
  } catch (error) {
    console.error('Invoice creation error:', error);
    return { success: false, error: 'Payment system not configured' };
  }
}
