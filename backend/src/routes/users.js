'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/user');

router.use(protect);

router.get('/me', userController.getMe);
router.put('/me', validate(updateProfileSchema), userController.updateProfile);
router.get('/search', userController.searchUsers);
router.get('/suggestions', userController.getSuggestions);
router.get('/:id', userController.getUserById);

module.exports = router;
