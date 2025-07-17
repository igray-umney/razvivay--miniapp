// api/telegram/create-invoice.js
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
    const { userId, amount, description } = req.body;
    
    console.log('Creating invoice:', { userId, amount, description });
    
    // Получаем базовый URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : `https://${req.headers.host}`;
    
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_invoice',
        userId,
        amount,
        description
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
