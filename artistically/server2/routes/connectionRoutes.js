const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

// Route to send a connection request
router.post('/send', connectionController.sendConnectionRequest);

// Route to accept a connection request
router.put('/accept/:requestId', connectionController.acceptConnectionRequest);

// Route to reject a connection request
router.put('/reject/:requestId', connectionController.rejectConnectionRequest);

module.exports = router;