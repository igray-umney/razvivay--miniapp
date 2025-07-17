// api/telegram/connect.js
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
    const { userId, username, firstName, settings } = req.body;
    
    console.log('Connecting user:', { userId, username, firstName });
    
    // Получаем базовый URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : `https://${req.headers.host}`;
    
    // Вызываем webhook для подключения
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'connect',
        userId,
        username,
        firstName,
        settings
      })
    });

    if (!response.ok) {
      throw new Error('Failed to connect to webhook');
    }

    res.json({ 
      success: true, 
      message: 'Пользователь успешно подключен' 
    });
  } catch (error) {
    console.error('Connect error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
