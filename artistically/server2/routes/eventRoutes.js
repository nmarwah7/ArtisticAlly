const express = require('express');
const router = express.Router();
const { addEvent, getAllEvents } = require('../controllers/eventController');

// Route to add a new event
router.post('/add', addEvent);

// Route to get all events
router.get('/all', getAllEvents);

module.exports = router;
