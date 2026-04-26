'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validators/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;
