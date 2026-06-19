const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are Penny, a friendly and enthusiastic financial coach for children aged 8-16.
Your goal is to make learning about money fun, simple, and encouraging.
Rules:
- Keep responses to 2-3 sentences maximum
- Use simple words a child can understand
- Use emojis occasionally to make it fun
- Give practical, relatable examples (allowance, toys, candy, games)
- Be encouraging and positive
- Focus on: saving, spending wisely, investing basics, earning, budgeting, stocks
- Never use complex financial jargon without explaining it
- If asked something off-topic, gently redirect to money/finance`;

const FALLBACK_RESPONSES = {
    allowance: "An allowance is money your parents give you, often for doing chores! 🏠 A smart move is to save at least 20% of it — that means if you get $10, save $2. The rest you can spend or share!",
    save: "Saving means setting money aside for something important later! 🐷 Instead of spending all your birthday money on candy, you could save it and buy something way cooler in a few weeks.",
    spend: "Spending wisely means thinking before you buy! 🤔 Ask yourself: do I NEED this, or do I just WANT it? Needs come first, then wants!",
    invest: "Investing is like planting a money seed! 🌱 You put money into something (like a company's stock), and if the company grows, your money grows too! It's how wealth is built over time.",
    stock: "A stock is a tiny piece of a real company! 📈 When you buy Apple stock, you own a small part of Apple. If Apple does well and makes money, your stock becomes more valuable!",
    budget: "A budget is just a plan for your money! 📊 For every $10 you get, try: $5 for spending, $3 for saving, $2 for giving. This is called the 50-30-20 rule for kids!",
    money: "Money is a tool we use to trade for things we need and want! 💰 We earn it by doing work, save it for the future, spend it wisely, and can even invest it to make more money.",
    piggy: "A piggy bank is a great start for saving! 🐷 It's a safe place to store your coins and bills. Watching it get heavier is so exciting — every coin gets you closer to your goal!",
    default: "Great question about money! 💡 Remember the golden rule: spend some, save some, and invest some. Even saving just a little bit every week adds up to something BIG over time!"
};

function getFallback(message) {
    const lower = message.toLowerCase();
    if (lower.includes('allowance')) return FALLBACK_RESPONSES.allowance;
    if (lower.includes('save') || lower.includes('saving')) return FALLBACK_RESPONSES.save;
    if (lower.includes('spend') || lower.includes('spending')) return FALLBACK_RESPONSES.spend;
    if (lower.includes('invest') || lower.includes('stock')) return FALLBACK_RESPONSES.invest;
    if (lower.includes('stock') || lower.includes('share')) return FALLBACK_RESPONSES.stock;
    if (lower.includes('budget') || lower.includes('plan')) return FALLBACK_RESPONSES.budget;
    if (lower.includes('money') || lower.includes('cash')) return FALLBACK_RESPONSES.money;
    if (lower.includes('piggy') || lower.includes('bank')) return FALLBACK_RESPONSES.piggy;
    return FALLBACK_RESPONSES.default;
}

exports.handleChat = async (req, res) => {
    try {
        if (!req.body || !req.body.message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.log('No Gemini API key — using fallback');
            return res.json({
                success: true,
                message: getFallback(message),
                isFallback: true
            });
        }

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: [{
                    parts: [{ text: message }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                }
            },
            { timeout: 8000 }
        );

        const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiText) throw new Error('Empty Gemini response');

        return res.json({ success: true, message: aiText.trim() });

    } catch (error) {
        console.error('Chat error:', error.message);
        const fallback = getFallback(req.body?.message || '');
        return res.json({ success: true, message: fallback, isFallback: true });
    }
};