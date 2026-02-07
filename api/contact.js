// Vercel Serverless Function - Contact Form Handler
// Sends notification to Fishhead via Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '806302390';

export default async function handler(req, res) {
  // CORS headers
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
    const { school, name, phone, interest, teachers, notes } = req.body;

    // Validate required fields
    if (!school || !name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format message for Telegram
    const message = `📩 新查詢 - preciousai.hk

🏫 學校：${school}
👤 聯絡人：${name}
📱 電話：${phone}
📦 有興趣方案：${interest || '未選擇'}
👥 老師人數：${teachers || '未填'}
📝 備註：${notes || '無'}

⏰ ${new Date().toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong' })}`;

    // Send to Telegram
    if (TELEGRAM_BOT_TOKEN) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
    }

    return res.status(200).json({ success: true, message: '查詢已收到，我們會盡快聯絡你！' });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
