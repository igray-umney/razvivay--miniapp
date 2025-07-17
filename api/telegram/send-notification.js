// api/telegram/send-notification.js
export default async function handler(req, res) {
  // CORS
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
    const { userId, message } = req.body;
    
    console.log('Sending notification:', { userId, message });
    
    // Получаем базовый URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : `https://${req.headers.host}`;
    
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_notification',
        userId,
        message
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send notification');
    }

    res.json({ 
      success: true, 
      message: 'Уведомление отправлено' 
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
