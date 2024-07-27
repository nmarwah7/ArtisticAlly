const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getContactId, getAllUsers } = require('../controllers/messageController');

// Route to send a message
router.post('/send', sendMessage);

// Route to get messages between two users
router.get('/:userId/:contactId', getMessages);

// Route to get contact ID by email
router.get('/contact/:contactEmail', getContactId);

// Route to get all users (replaces getContacts functionality)
router.get('/users/all/filtered', getAllUsers);

module.exports = router;
