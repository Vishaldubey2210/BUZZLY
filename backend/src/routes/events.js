'use strict';

const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(eventController.getEvents)
  .post(eventController.createEvent);

router.route('/:id')
  .get(eventController.getEventById)
  .put(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.post('/:id/rsvp', eventController.rsvpEvent);
router.delete('/:id/rsvp', eventController.unrsvpEvent);

module.exports = router;
