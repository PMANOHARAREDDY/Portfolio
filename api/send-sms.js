// Deprecated: SMS functionality removed. Replaced by /api/send-telegram.js
export default function handler(req, res) {
    return res.status(410).json({ error: 'Endpoint Deprecated. Please use /api/send-telegram' });
}
