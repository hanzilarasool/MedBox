// routes/chat.js
const express = require('express');
const router = express.Router();
const { generateMedicalResponse } = require('../controllers/chat-controllers');
const {authenticate} = require('../middleware/auth');

router.post('/', authenticate, generateMedicalResponse);

module.exports = router;