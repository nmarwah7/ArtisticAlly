const express = require('express');
const router = express.Router();
const pendingRequestsController = require('../controllers/pendingRequestsController');

router.get('/:userEmail', pendingRequestsController.getPendingRequests);

module.exports = router;