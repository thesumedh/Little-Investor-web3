const express = require('express');
const route = express.Router();
const mainController = require('../controller/mainController');
const chatController = require('../controller/chatController');
const quizController = require('../controller/quizController');
const stellarController = require('../controller/stellarController');

// API routes
route.post('/api/chat', chatController.handleChat);
route.get('/api/quiz/:id', quizController.getQuizData);
route.get('/api/stocks', mainController.getLiveStocks);
route.get('/api/market-news', mainController.getMarketNews);

// Stellar/Soroban routes
route.get('/api/stellar/balance/:address', stellarController.getBalance);
route.post('/api/stellar/faucet', stellarController.fundFaucet);
route.post('/api/stellar/child/create', stellarController.createChildProfile);
route.post('/api/stellar/vault/deploy', stellarController.deployVault);
route.post('/api/stellar/vault/initialize', stellarController.initializeVault);
route.post('/api/stellar/vault/set-limit', stellarController.setVaultLimit);
route.post('/api/stellar/vault/spend', stellarController.vaultSpend);
route.post('/api/stellar/vault/save', stellarController.vaultSave);
route.get('/api/stellar/vault/details/:contractId', stellarController.getVaultDetails);
route.post('/api/stellar/vault/reward', stellarController.sendReward);
route.post('/api/stellar/payment', stellarController.sendPayment);
route.post('/api/stellar/transaction/submit', stellarController.submitTransaction);

// Page routes
route.get('/', mainController.landing);
route.get('/home', mainController.home);
route.get('/courses', mainController.courses);
route.get('/chatbot', mainController.chatbot);
route.get('/course', mainController.course);
route.get('/quiz', mainController.getQuiz);
route.get('/parent', mainController.parent);
route.get('/profile', mainController.profile);
route.get('/telemetry-test', (req, res) => {
    if (req.query.key === 'pennymoney') {
        return mainController.simulate(req, res);
    }
    res.status(404).redirect('/');
});

// Catch-all
route.all('/*', (req, res) => {
    res.status(404).redirect('/');
});

module.exports = route;
