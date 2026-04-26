'use strict';

const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', mentorController.getMentors);
router.post('/register', mentorController.registerMentor);
router.post('/sessions/book', mentorController.bookSession);
router.get('/sessions/me', mentorController.getMySessions);

module.exports = router;
