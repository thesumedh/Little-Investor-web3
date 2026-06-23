const axios = require('axios');

// ===== CRYPTO PRICE CACHE (5-min TTL) =====
let stockCache = null;
let stockCacheTime = 0;
const STOCK_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Scale factors to make actual crypto prices fit a kid's $800 balance
const scaleFactors = {
    btc: 0.01,   // $65,000 -> $650
    eth: 0.1,    // $3,200 -> $320
    sol: 1.0,    // $145 -> $145
    dot: 5.0,    // $6 -> $30
    ada: 100.0,  // $0.40 -> $40
    doge: 100.0  // $0.12 -> $12
};

const FALLBACK_STOCKS = {
    sol:  { price: 145.00, change: 3.20, changePercent: 2.26, direction: 'up', name: 'Solana', logo: '☀️' },
    eth:  { price: 320.00, change: -4.80, changePercent: -1.48, direction: 'down', name: 'Ethereum', logo: '⟠' },
    btc:  { price: 650.00, change: 12.50, changePercent: 1.96, direction: 'up', name: 'Bitcoin', logo: '🪙' },
    dot:  { price: 30.00,  change: 0.45, changePercent: 1.52, direction: 'up', name: 'Polkadot', logo: '🔴' },
    ada:  { price: 40.00,  change: -0.90, changePercent: -2.20, direction: 'down', name: 'Cardano', logo: '🌀' },
    doge: { price: 12.00,  change: 0.60, changePercent: 5.26, direction: 'up', name: 'Dogecoin', logo: '🐕' }
};

// Day-seeded variation so simulated prices change daily but stay consistent within a day
function getDailyVariation(key) {
    const d = new Date();
    const seed = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) * 31 + key.charCodeAt(0) * 17;
    const rand = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return (rand - Math.floor(rand) - 0.5) * 0.040; // ±2% max variation
}

const STOCK_SYMBOLS = {
    sol: 'SOL-USD',
    eth: 'ETH-USD',
    btc: 'BTC-USD',
    dot: 'DOT-USD',
    ada: 'ADA-USD',
    doge: 'DOGE-USD'
};

// ===== ALL 5 LESSONS =====
const LESSONS = {
    1: {
        id: 1,
        icon: '🔗',
        title: 'What is a Blockchain?',
        subtitle: 'The magic behind digital trust',
        description: 'Imagine a notebook that everyone in the world has a copy of. When someone writes a new entry, everyone\'s notebook updates automatically. Once something is written, it can never be erased or changed! That\'s a blockchain. It\'s a secure, shared, digital diary where blocks of information are chained together. Because there is no single owner, it\'s called "decentralized". This means we don\'t need a big bank or company to keep track of our money or information — the blockchain does it automatically and securely!',
        videoId: 'vPMDpb9ho4s',
        xp: 100,
        coins: 10,
        duration: '5 min',
        upNextId: 2,
        upNext: 'Cryptography & Blocks — Locking the Chain'
    },
    2: {
        id: 2,
        icon: '🔒',
        title: 'Cryptography & Blocks',
        subtitle: 'How blocks are locked and chained',
        description: 'How does a blockchain stay secure without a password? The answer is Cryptography — secret codes! Every block on the blockchain has a special fingerprint called a "hash". This hash is made of numbers and letters, and it changes completely if even a single letter in the block is modified. Each block also contains the hash of the block before it. This links them together like a real chain! If someone tries to change an old block, the chain breaks instantly, and everyone knows. It\'s like having a digital lock on every page of our diary!',
        videoId: 'u0W3z1Y61oM',
        xp: 120,
        coins: 12,
        duration: '5 min',
        upNextId: 3,
        upNext: 'Coins & Wallets — Digital Money'
    },
    3: {
        id: 3,
        icon: '🪙',
        title: 'Coins & Wallets',
        subtitle: 'Digital money on the blockchain',
        description: 'Cryptocurrencies are digital coins that live on a blockchain. Unlike paper cash or metal coins in your piggy bank, you can\'t touch them! The two most famous cryptocurrencies are Bitcoin and Ethereum. Instead of keeping them in a physical wallet, you store them in a digital wallet. This wallet doesn\'t hold the coins itself; it holds your "private key" — which is like a super-secret password that proves you own those coins. Remember: never share your private key with anyone, or they can steal your coins!',
        videoId: 'xvo_m_r2ubg',
        xp: 140,
        coins: 14,
        duration: '5 min',
        upNextId: 4,
        upNext: 'How Consensus Works — Mining & Validators'
    },
    4: {
        id: 4,
        icon: '⚡',
        title: 'How Consensus Works',
        subtitle: 'Voting and agreeing on the truth',
        description: 'Since there is no boss in a blockchain, how does everyone agree on which transactions are real? They use "consensus" rules! In "Proof of Work" (like Bitcoin), computer owners called "miners" solve extremely hard math puzzles to add blocks and get rewarded with new coins. In "Proof of Stake" (like Ethereum), people lock up some of their own coins (stake them) to get a chance to validate transactions. Both methods ensure that everyone\'s digital notebooks stay in perfect agreement without anyone cheating!',
        videoId: 'u0W3z1Y61oM',
        xp: 160,
        coins: 16,
        duration: '6 min',
        upNextId: 5,
        upNext: 'Smart Contracts & Web3 — Code is Law'
    },
    5: {
        id: 5,
        icon: '📜',
        title: 'Smart Contracts & Web3',
        subtitle: 'Programs that run on the blockchain',
        description: 'What if money could think? Smart contracts are digital agreements written in code that run automatically on the blockchain when rules are met. For example: "If Liam cleans his room, transfer 10 digital coins from Mom\'s wallet." No human needs to check or press send; the code does it! Smart contracts power Web3 — a new version of the internet where you own your digital items, like gaming items and art (NFTs), instead of big companies owning them. It\'s the future of the web!',
        videoId: 'ZE2HxTmxfrI',
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
        title: 'What is a Blockchain?',
        questions: [
            { q: 'What is a blockchain?', options: ['A chain made of metal', 'A shared digital notebook that cannot be changed', 'A type of video game', 'A bank vault'], correct: 1, explanation: 'Blockchain is a decentralized, secure digital ledger that records transactions across many computers, so it cannot be altered.' },
            { q: 'What does "decentralized" mean?', options: ['Controlled by one single boss', 'Spread out with no single owner or boss', 'Located in the center of a city', 'Broken and not working'], correct: 1, explanation: 'Decentralized means power and control are distributed, so there is no central authority like a bank or boss.' },
            { q: 'Once information is written to a blockchain, what happens?', options: ['It can be deleted easily', 'It gets automatically erased after a day', 'It is permanent and cannot be changed', 'It becomes invisible to everyone'], correct: 2, explanation: 'Immutability is a core feature of blockchain — once written, blocks cannot be modified.' }
        ]
    },
    2: {
        title: 'Cryptography & Blocks',
        questions: [
            { q: 'What is a "hash" in blockchain?', options: ['A delicious breakfast food', 'A unique digital fingerprint for a block', 'A type of key card', 'A computer virus'], correct: 1, explanation: 'A hash is a cryptographic string that acts as a unique signature or fingerprint for the data in a block.' },
            { q: 'How are blocks connected to form a chain?', options: ['With real metal links', 'By gluing pages together', 'Each block contains the hash of the block before it', 'By sending emails'], correct: 2, explanation: 'Every block references the hash of the previous block, creating an unbroken and tamper-proof chain.' },
            { q: 'What happens if someone tries to edit an old block?', options: ['Nothing, it works fine', 'The chain breaks because hashes no longer match', 'The block turns green', 'The computer gets turned off'], correct: 1, explanation: 'If old data is changed, its hash changes, breaking the link with the next block and alerting the network.' }
        ]
    },
    3: {
        title: 'Coins & Wallets',
        questions: [
            { q: 'Which of these is a famous cryptocurrency?', options: ['Dollar coin', 'Bitcoin', 'Robux', 'V-Bucks'], correct: 1, explanation: 'Bitcoin was the very first cryptocurrency created and is the most well-known.' },
            { q: 'Where do you store your cryptographic keys?', options: ['Under your mattress', 'In a digital wallet', 'In a real leather wallet', 'On a post-it note on your monitor'], correct: 1, explanation: 'A crypto wallet stores your public and private keys, allowing you to access and send your digital coins.' },
            { q: 'What is a private key?', options: ['A physical brass key', 'A secret password that proves you own your coins', 'Your email address', 'The logo of the coin'], correct: 1, explanation: 'A private key is like a secret digital signature that allows you to spend coins. You must never share it!' }
        ]
    },
    4: {
        title: 'How Consensus Works',
        questions: [
            { q: 'What are "miners" in a Proof of Work blockchain?', options: ['People who dig for gold in caves', 'Computers that solve math puzzles to validate blocks', 'Children who play Minecraft', 'People who write code for website pages'], correct: 1, explanation: 'Miners use computer power to solve complex cryptographic puzzles to secure the network and earn rewards.' },
            { q: 'What does "Proof of Stake" use instead of heavy puzzle solving?', options: ['Locking up (staking) coins to show you are trustworthy', 'Flipping a coin', 'Playing a video game tournament', 'Asking the bank for permission'], correct: 0, explanation: 'Proof of Stake validators lock up their own coins as collateral to show they will follow the rules and validate blocks honestly.' },
            { q: 'Why does a blockchain need "consensus"?', options: ['To make the website load faster', 'So all computers agree on the true list of transactions', 'To choose a cool logo', 'To shut down the network'], correct: 1, explanation: 'Consensus mechanisms ensure all nodes in the decentralized network agree on the ledger\'s official state.' }
        ]
    },
    5: {
        title: 'Smart Contracts & Web3',
        questions: [
            { q: 'What is a smart contract?', options: ['A paper agreement signed with a pen', 'A self-running program that automatically executes agreement rules', 'A contract that makes you look smart', 'A type of school homework'], correct: 1, explanation: 'A smart contract runs code automatically on the blockchain once specific conditions are met, with no middlemen.' },
            { q: 'What does Web3 allow you to do that old webs did not?', options: ['Send emails', 'Actually own your digital items (like NFTs and tokens)', 'Browse pages in color', 'Watch videos in high definition'], correct: 1, explanation: 'Web3 is the decentralized web where ownership of digital assets is held directly by users, not by central tech platforms.' },
            { q: 'What is an NFT?', options: ['A nice friendly teacher', 'A unique digital asset representing ownership of art, music, or game items', 'A type of fast internet cable', 'A new cryptocurrency coin'], correct: 1, explanation: 'NFT stands for Non-Fungible Token. It represents ownership of a specific, one-of-a-kind digital item on the blockchain.' }
        ]
    }
};

// ===== MARKET NEWS =====
const MARKET_NEWS = [
    { emoji: '🪙', text: 'Bitcoin hash rate hits new all-time high, securing the ledger' },
    { emoji: '💎', text: 'Ethereum validators lock up record staking coins post-upgrade' },
    { emoji: '☀️', text: 'Solana transactions surge as new Web3 games launch' },
    { emoji: '📜', text: 'Smart contract platforms see major usage increase for digital art' },
    { emoji: '🔐', text: 'Security experts remind users: Never share your private key' },
    { emoji: '⛏️', text: 'Bitcoin miners solve puzzles and receive blocks of block rewards' },
    { emoji: '🌐', text: 'Web3 decentralized applications reach 50 million active wallets' },
    { emoji: '🐕', text: 'Dogecoin transaction fees drop, making digital tips cheaper' }
];

// ===== FETCH SINGLE STOCK =====
const fetchYahooStock = async (symbol, key) => {
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
        
        let price = meta.regularMarketPrice;
        let prevClose = meta.chartPreviousClose || (closes[closes.length - 2] || price);
        
        const factor = scaleFactors[key] || 1.0;
        price = price * factor;
        prevClose = prevClose * factor;
        
        const change = price - prevClose;
        const changePercent = (change / prevClose) * 100;
        // sparkline: last 5 close prices (filter nulls)
        const sparkline = closes.filter(v => v != null).slice(-5).map(v => Math.round(v * factor * 100) / 100);

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
        const data = await fetchYahooStock(sym, key);
        result[key] = data
            ? { ...data, name: FALLBACK_STOCKS[key].name, logo: FALLBACK_STOCKS[key].logo }
            : (() => {
                // Simulate realistic daily price movement when Yahoo Finance is unavailable
                const base = FALLBACK_STOCKS[key];
                const variation = getDailyVariation(key);
                const priceChange = Math.round(base.price * variation * 100) / 100;
                const newPrice = Math.round((base.price + priceChange) * 100) / 100;
                const changePercent = Math.round(variation * 10000) / 100;
                return {
                    ...base,
                    price: newPrice,
                    change: priceChange,
                    changePercent,
                    direction: priceChange >= 0 ? 'up' : 'down',
                    simulated: true
                };
            })();
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

const simulate = async (req, res) => res.render('telemetry-test');

module.exports = { home, landing, courses, chatbot, course, parent, profile, getLiveStocks, getMarketNews, getQuiz, simulate };