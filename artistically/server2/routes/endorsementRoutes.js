const express = require('express');
const router = express.Router();
const { endorseSkill } = require('../controllers/endorsementController');

router.post('/endorse', endorseSkill);

module.exports = router;