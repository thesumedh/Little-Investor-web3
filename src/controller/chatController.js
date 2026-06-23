const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are Penny, a friendly and enthusiastic blockchain and cryptocurrency coach for children aged 8-16.
Your goal is to make learning about blockchain, bitcoin, wallets, and smart contracts fun, simple, and encouraging.
Rules:
- Keep responses to 2-3 sentences maximum
- Use simple words a child can understand
- Use emojis occasionally to make it fun
- Give practical, relatable examples (vending machines for smart contracts, diaries/notebooks for blockchain, digital keys for wallets)
- Be encouraging and positive
- Focus on: blockchain, bitcoin, ethereum, tokens, wallets, keys, mining, consensus, smart contracts, Web3
- Never use complex tech jargon without explaining it simply
- If asked something off-topic, gently redirect to blockchain/crypto`;

const FALLBACK_RESPONSES = {
    blockchain: "A blockchain is like a shared digital notebook that everyone has a copy of! 🔗 When a new page (block) is added, it is locked with cryptography so it can never be changed or erased.",
    wallet: "A crypto wallet is like a digital mailbox! ✉️ It has an address everyone can see to send you coins, but only you have the secret key (password) to open it and spend your coins.",
    bitcoin: "Bitcoin was the very first cryptocurrency! 🪙 It's digital money that doesn't need a central bank or boss to run, because computers all over the world work together to keep it safe.",
    ethereum: "Ethereum is a blockchain that lets developers build apps, not just track money! 💎 It runs smart contracts, which are automatic, self-running agreements.",
    mining: "Mining is when super-powerful computers solve math puzzles to verify transactions on a blockchain! ⛏️ The first computer to solve the puzzle gets to add the new block and earns shiny new coins as a reward.",
    smart: "A smart contract is like a digital vending machine! 📜 You put in the right input (like completing a chore), and it automatically gives you the output (like sending coins) without needing a human to help.",
    key: "A private key is like a super-secret password for your crypto! 🔑 If anyone else gets it, they can take all your coins. Keep it safe and never share it!",
    default: "Great question about blockchain! 💡 Remember, blockchain is all about building trust online using cryptography and shared networks. What else would you like to know?"
};

function getFallback(message) {
    const lower = message.toLowerCase();
    if (lower.includes('wallet') || lower.includes('address')) return FALLBACK_RESPONSES.wallet;
    if (lower.includes('bitcoin') || lower.includes('btc')) return FALLBACK_RESPONSES.bitcoin;
    if (lower.includes('ethereum') || lower.includes('eth')) return FALLBACK_RESPONSES.ethereum;
    if (lower.includes('mining') || lower.includes('miner') || lower.includes('consensus')) return FALLBACK_RESPONSES.mining;
    if (lower.includes('smart') || lower.includes('contract')) return FALLBACK_RESPONSES.smart;
    if (lower.includes('key') || lower.includes('password') || lower.includes('private')) return FALLBACK_RESPONSES.key;
    if (lower.includes('blockchain') || lower.includes('ledger') || lower.includes('block')) return FALLBACK_RESPONSES.blockchain;
    return FALLBACK_RESPONSES.default;
}

exports.handleChat = async (req, res) => {
    try {
        if (!req.body || !req.body.message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const message = String(req.body.message).trim().slice(0, 500);
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }
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

        return res.json({ success: true, message: aiText.trim(), source: 'gemini' });

    } catch (error) {
        console.error('Chat error:', error.message);
        const fallback = getFallback(req.body?.message || '');
        return res.json({ success: true, message: fallback, isFallback: true });
    }
};
