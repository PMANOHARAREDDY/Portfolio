export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, subject, message } = req.body;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    const alertMessage = `🔔 New Portfolio Message!\n\nUser Details:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nSubject: ${subject}\nMessage: ${message}`;

    if (!telegramBotToken || !telegramChatId) {
        return res.status(200).json({ 
            success: false, 
            warning: 'Telegram credentials are not configured on Vercel.' 
        });
    }

    try {
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: alertMessage
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: data.description });
        }
    } catch (error) {
        console.error('Telegram API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
