'use strict';

const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendMessageSchema } = require('../validators/message');

router.use(protect);

router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.createConversation);
router.get('/:conversationId', messageController.getMessages);
router.post('/:conversationId', validate(sendMessageSchema), messageController.sendMessage);

module.exports = router;
