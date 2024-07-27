const express = require('express');
const router = express.Router();
const { addJob, getAllJobs, reportJob } = require('../controllers/jobController');

// Route to add a new job
router.post('/add', addJob);

// Route to get all jobs
router.get('/all', getAllJobs);

// Route to report a job
router.post('/report', reportJob);

module.exports = router;
