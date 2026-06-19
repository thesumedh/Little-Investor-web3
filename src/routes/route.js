const express = require('express');
const route = express.Router();
const mainController = require('../controller/mainController');
const chatController = require('../controller/chatController');
const quizController = require('../controller/quizController');

// API routes
route.post('/api/chat', chatController.handleChat);
route.get('/api/quiz/:id', quizController.getQuizData);
route.get('/api/stocks', mainController.getLiveStocks);
route.get('/api/market-news', mainController.getMarketNews);

// Page routes
route.get('/', mainController.landing);
route.get('/home', mainController.home);
route.get('/courses', mainController.courses);
route.get('/chatbot', mainController.chatbot);
route.get('/course', mainController.course);
route.get('/quiz', mainController.getQuiz);
route.get('/parent', mainController.parent);
route.get('/profile', mainController.profile);
route.get('/simulate', mainController.simulate);

// Catch-all
route.all('/*', (req, res) => {
    res.status(404).redirect('/');
});

module.exports = route;
