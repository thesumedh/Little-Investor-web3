// Quiz controller now delegates to mainController's QUIZZES data
// This file is kept for backward compatibility with the existing route

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
