'use strict';

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(roomController.getRooms)
  .post(roomController.createRoom);

router.post('/join', roomController.joinRoom); // For invite codes
router.post('/:id/join', roomController.joinRoom);
router.post('/:id/leave', roomController.leaveRoom);

module.exports = router;
