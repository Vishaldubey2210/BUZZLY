'use strict';

const express = require('express');
const router = express.Router();

const connectionController = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', connectionController.getConnections);
router.get('/requests/pending', connectionController.getPendingRequests);
router.post('/request/:userId', connectionController.sendRequest);
router.put('/accept/:id', connectionController.acceptRequest);
router.delete('/reject/:id', connectionController.rejectRequest);

module.exports = router;
