'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/me', userController.getMe);
router.put('/me', userController.updateProfile);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/search', userController.searchUsers);
router.get('/suggestions', userController.getSuggestions);
// Drink Journey
router.post('/me/drink-journey', userController.addDrinkJourney);
router.put('/me/drink-journey/:entryId', userController.updateDrinkJourney);
router.delete('/me/drink-journey/:entryId', userController.deleteDrinkJourney);
// By ID
router.get('/:id/stats', userController.getUserStats);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);
router.post('/:id/follow', userController.followUser);
router.get('/:id', userController.getUserById);

module.exports = router;
