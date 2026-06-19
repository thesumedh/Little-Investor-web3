const axios = require('axios');

// ===== STOCK CACHE (5-min TTL) =====
let stockCache = null;
let stockCacheTime = 0;
const STOCK_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const FALLBACK_STOCKS = {
    aapl: { price: 226.80, change: 1.13, changePercent: 0.50, direction: 'up', name: 'Apple Inc.', logo: '🍎' },
    amzn: { price: 186.51, change: 4.55, changePercent: 2.50, direction: 'up', name: 'Amazon.com', logo: '📦' },
    wmt:  { price: 80.94,  change: 0.51, changePercent: 0.60, direction: 'up', name: 'Walmart Inc.', logo: '🏪' },
    tsla: { price: 180.20, change: -1.45, changePercent: -0.80, direction: 'down', name: 'Tesla Inc.', logo: '⚡' },
    googl:{ price: 175.40, change: 2.10, changePercent: 1.21, direction: 'up', name: 'Alphabet Inc.', logo: '🔍' },
    msft: { price: 420.10, change: 3.50, changePercent: 0.84, direction: 'up', name: 'Microsoft Corp.', logo: '💻' }
};

const STOCK_SYMBOLS = { aapl: 'AAPL', amzn: 'AMZN', wmt: 'WMT', tsla: 'TSLA', googl: 'GOOGL', msft: 'MSFT' };

// ===== ALL 5 LESSONS =====
const LESSONS = {
    1: {
        id: 1,
        icon: '🪙',
        title: 'What is Money?',
        subtitle: 'The basics of money explained simply',
        description: 'Money is a tool we use to trade value with each other. Instead of swapping your apples for someone\'s oranges, we use coins and bills that everyone agrees have value. Money lets you save up for things you want, pay for services, and plan for the future. There are three main things money does: it\'s a medium of exchange (you use it to buy things), a store of value (you can save it), and a unit of account (you can measure how much something is worth).',
        videoId: '0iRbD5rM5qc',
        xp: 100,
        coins: 10,
        duration: '5 min',
        upNextId: 2,
        upNext: 'Saving — How to Stack Your Coins'
    },
    2: {
        id: 2,
        icon: '🐷',
        title: 'Saving — Stack Your Coins',
        subtitle: 'Build the habit of saving money',
        description: 'Saving is one of the most powerful money habits you can build! When you save a little bit every time you get money, it adds up fast. The trick is to pay yourself first — before you spend anything, put a set amount aside. Think of it like leveling up in a video game — every coin you save gets you closer to your goal. Even saving just $1 a day adds up to $365 in a year. Most financial experts recommend saving at least 20% of any money you receive.',
        videoId: 'PnFbr_3LNZk',
        xp: 120,
        coins: 12,
        duration: '5 min',
        upNextId: 3,
        upNext: 'Spending Wisely — Making Smart Choices'
    },
    3: {
        id: 3,
        icon: '🛒',
        title: 'Spending Wisely',
        subtitle: 'Make every dollar count',
        description: 'Spending wisely means thinking before you buy. Ask yourself: "Do I need this, or do I just want it?" Needs are things you must have (food, shelter, school supplies). Wants are things you\'d like to have but can survive without. A great trick is the 24-hour rule — wait one full day before buying something non-essential. If you still want it the next day, it might be worth it! Also, compare prices before buying and look for sales. Smart spenders get more for their money.',
        videoId: 'H9SMfmZKvog',
        xp: 140,
        coins: 14,
        duration: '5 min',
        upNextId: 4,
        upNext: 'Understanding Risk'
    },
    4: {
        id: 4,
        icon: '⚡',
        title: 'Understanding Risk',
        subtitle: 'Higher risk can mean higher reward',
        description: 'Risk is the chance that something might not go the way you planned. When you invest money, there\'s always a risk you might lose some of it — but there\'s also a chance to gain more! Generally, investments with higher potential returns come with higher risk. Keeping all your money in one place is risky — if that one thing fails, you lose everything. That\'s why smart investors "diversify" — they spread their money across many different investments. A savings account has very low risk but grows slowly. Stocks have higher risk but can grow much faster.',
        videoId: 'xtl6s9SxHW8',
        xp: 160,
        coins: 16,
        duration: '6 min',
        upNextId: 5,
        upNext: 'Investing Basics — Make Your Money Work'
    },
    5: {
        id: 5,
        icon: '🌱',
        title: 'Investing Basics',
        subtitle: 'Make your money work for you',
        description: 'Investing means putting your money to work so it can grow over time. When you buy a share of a company\'s stock, you\'re buying a tiny piece of that company. If the company does well, your share becomes worth more! The stock market lets anyone own parts of amazing companies like Apple, Amazon, and Google. One of the most powerful concepts in investing is compound growth — your gains themselves start earning gains. Albert Einstein called compound interest "the eighth wonder of the world." Starting early is the most important thing — money invested at age 12 is worth far more than the same money invested at age 22.',
        videoId: '2T6R3oCh-lI',
        xp: 200,
        coins: 20,
        duration: '7 min',
        upNextId: null,
        upNext: null
    }
};

// ===== QUIZ DATA =====
const QUIZZES = {
    1: {
        title: 'What is Money?',
        questions: [
            { q: 'What is the main purpose of money?', options: ['To collect and display', 'To trade value for goods and services', 'To make banks rich', 'Just for fun'], correct: 1, explanation: 'Money is a medium of exchange — we use it to trade for goods and services instead of bartering.' },
            { q: 'If you save $1 every day for a year, how much will you have?', options: ['$100', '$200', '$365', '$500'], correct: 2, explanation: 'There are 365 days in a year, so saving $1 per day gives you $365!' },
            { q: 'Which of these is a "store of value"?', options: ['A gift card that expires tomorrow', 'Coins in a piggy bank', 'A borrowed book', 'A borrowed pencil'], correct: 1, explanation: 'Coins in a piggy bank store value for you to use later — that\'s one of money\'s key functions!' }
        ]
    },
    2: {
        title: 'Saving — Stack Your Coins',
        questions: [
            { q: 'What does "pay yourself first" mean?', options: ['Buy things before others do', 'Save money before spending anything', 'Give money to your parents', 'Spend all your money on yourself'], correct: 1, explanation: '"Pay yourself first" means saving a portion of your money before spending anything else.' },
            { q: 'What percentage do financial experts recommend saving?', options: ['5%', '10%', '15%', '20%'], correct: 3, explanation: 'Most financial experts recommend saving at least 20% of any money you receive.' },
            { q: 'What is a savings goal?', options: ['A specific item you want to buy eventually', 'The amount you spend per day', 'Money you give to charity', 'Your total debt'], correct: 0, explanation: 'A savings goal is a specific thing you\'re working toward buying — it motivates you to save!' }
        ]
    },
    3: {
        title: 'Spending Wisely',
        questions: [
            { q: 'What\'s the difference between a "need" and a "want"?', options: ['Needs cost more', 'Needs are essential for survival; wants are extras', 'Wants are more important', 'There is no difference'], correct: 1, explanation: 'Needs are things required to live (food, shelter). Wants are extras we\'d like but could survive without.' },
            { q: 'What is the 24-hour rule?', options: ['Only shop for 24 hours per week', 'Wait 24 hours before making a non-essential purchase', 'Save 24 cents per day', 'Return items within 24 hours'], correct: 1, explanation: 'The 24-hour rule means waiting a full day before buying something non-essential — it prevents impulse buying!' },
            { q: 'Why should you compare prices before buying?', options: ['It wastes time', 'Prices are always the same everywhere', 'You might find the same thing cheaper elsewhere', 'Stores don\'t like it'], correct: 2, explanation: 'Comparing prices is smart spending — the same item can cost very different amounts at different stores!' }
        ]
    },
    4: {
        title: 'Understanding Risk',
        questions: [
            { q: 'What does "diversify" mean in investing?', options: ['Put all money in one stock', 'Spread money across many different investments', 'Only invest in foreign countries', 'Never invest at all'], correct: 1, explanation: 'Diversification means spreading money across multiple investments so a single failure doesn\'t ruin everything.' },
            { q: 'Which is generally lower risk?', options: ['Cryptocurrency', 'A startup company\'s stock', 'A savings account', 'Penny stocks'], correct: 2, explanation: 'Savings accounts are FDIC-insured and guaranteed, making them very low risk (but also lower reward).' },
            { q: 'Higher risk investments usually have...', options: ['Lower potential returns', 'Higher potential returns', 'No returns ever', 'Guaranteed returns'], correct: 1, explanation: 'The risk-return tradeoff: higher risk generally means higher potential rewards (but also higher potential losses).' }
        ]
    },
    5: {
        title: 'Investing Basics',
        questions: [
            { q: 'What do you own when you buy a stock?', options: ['A product from the company', 'A tiny piece of that company', 'A loan to that company', 'A discount at that company'], correct: 1, explanation: 'Stocks represent ownership shares — buying one makes you a part-owner of that company!' },
            { q: 'What is compound growth?', options: ['Growing plants with money', 'When your gains themselves start earning gains', 'A type of bank account', 'A government savings plan'], correct: 1, explanation: 'Compound growth means your returns earn returns — it\'s how small amounts grow into large ones over time.' },
            { q: 'Why does starting to invest young matter so much?', options: ['Young people get better stock prices', 'More time for compound growth to work', 'Young people are smarter', 'Stocks are cheaper when young'], correct: 1, explanation: 'Time is the most powerful force in investing — the longer your money compounds, the more dramatically it grows.' }
        ]
    }
};

// ===== MARKET NEWS =====
const MARKET_NEWS = [
    { emoji: '📊', text: 'Tech stocks rise as AI investment continues to boom' },
    { emoji: '🛒', text: 'Walmart reports strong quarterly earnings, shares up 2%' },
    { emoji: '🍎', text: 'Apple\'s new product lineup drives record iPhone sales' },
    { emoji: '🚗', text: 'Electric vehicle demand continues growing worldwide' },
    { emoji: '💰', text: 'S&P 500 hits new all-time highs driven by Big Tech rally' },
    { emoji: '🌍', text: 'Global markets steady as inflation continues to cool' },
    { emoji: '📱', text: 'Amazon Prime membership reaches 200 million users globally' },
    { emoji: '🔋', text: 'Clean energy stocks surge on new government incentives' }
];

// ===== FETCH SINGLE STOCK =====
const fetchYahooStock = async (symbol) => {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 6000
        });
        const chart = response.data?.chart?.result?.[0];
        if (!chart) return null;
        const meta = chart.meta;
        const closes = chart.indicators?.quote?.[0]?.close || [];
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || (closes[closes.length - 2] || price);
        const change = price - prevClose;
        const changePercent = (change / prevClose) * 100;
        // sparkline: last 5 close prices (filter nulls)
        const sparkline = closes.filter(v => v != null).slice(-5).map(v => Math.round(v * 100) / 100);

        return {
            price: Math.round(price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            direction: change >= 0 ? 'up' : 'down',
            sparkline
        };
    } catch (e) {
        console.error(`Error fetching ${symbol}:`, e.message);
        return null;
    }
};

// ===== ROUTES =====
const home = async (req, res) => res.render('home');
const landing = async (req, res) => res.render('landing');
const courses = async (req, res) => res.render('courses', { lessons: LESSONS });
const chatbot = async (req, res) => res.render('chatbot');
const parent = async (req, res) => res.render('parent');
const profile = async (req, res) => res.render('profile');

const course = async (req, res) => {
    const lessonId = parseInt(req.query.lesson) || 1;
    const lesson = LESSONS[lessonId] || LESSONS[1];
    res.render('course', { lesson, lessons: LESSONS });
};

const getQuiz = async (req, res) => {
    const lessonId = parseInt(req.query.lesson) || 1;
    const quiz = QUIZZES[lessonId] || QUIZZES[1];
    res.render('quiz', { quiz, lessonId });
};

const getLiveStocks = async (req, res) => {
    // Return cache if still fresh
    const now = Date.now();
    if (stockCache && (now - stockCacheTime) < STOCK_CACHE_TTL) {
        return res.json({ success: true, stocks: stockCache, cached: true });
    }

    const result = {};
    // Fetch all in parallel for speed
    const fetchPromises = Object.entries(STOCK_SYMBOLS).map(async ([key, sym]) => {
        const data = await fetchYahooStock(sym);
        result[key] = data
            ? { ...data, name: FALLBACK_STOCKS[key].name, logo: FALLBACK_STOCKS[key].logo }
            : FALLBACK_STOCKS[key];
    });

    await Promise.allSettled(fetchPromises);

    // Update cache
    stockCache = result;
    stockCacheTime = now;

    res.json({ success: true, stocks: result });
};

const getMarketNews = async (req, res) => {
    // Shuffle and return 4 news items
    const shuffled = [...MARKET_NEWS].sort(() => 0.5 - Math.random());
    res.json({ success: true, news: shuffled.slice(0, 4) });
};

const simulate = async (req, res) => res.render('simulate');

module.exports = { home, landing, courses, chatbot, course, parent, profile, getLiveStocks, getMarketNews, getQuiz, simulate };