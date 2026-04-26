'use strict';

const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', venueController.getVenues);
router.get('/:id', venueController.getVenueById);
router.post('/:id/follow', venueController.followVenue);

module.exports = router;
