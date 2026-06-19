// Quiz controller now delegates to mainController's QUIZZES data
// This file is kept for backward compatibility with the existing route

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

exports.getQuiz = (req, res) => {
    const lessonId = parseInt(req.query.lesson) || 1;
    const quiz = QUIZZES[lessonId] || QUIZZES[1];
    res.render('quiz', { quiz, lessonId });
};

exports.getQuizData = (req, res) => {
    const lessonId = parseInt(req.params.id) || 1;
    const quiz = QUIZZES[lessonId] || QUIZZES[1];
    res.json({ success: true, quiz });
};
