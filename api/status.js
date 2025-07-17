// api/status.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.json({
    status: 'OK',
    service: 'Развивайка API',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    bot_token: process.env.TELEGRAM_BOT_TOKEN ? 'configured' : 'missing',
    mini_app_url: process.env.MINI_APP_URL || 'not set',
    version: '1.0.0'
  });
}
