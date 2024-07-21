const express = require('express');
const router = express.Router();
const { getAcceptedConnections, getConnectionDetails } = require('../controllers/acceptController');

router.get('/accepted/:email', getAcceptedConnections);
router.get('/details/:email', getConnectionDetails);

module.exports = router;
