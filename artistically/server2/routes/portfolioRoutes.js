const express = require('express');
const router = express.Router();
const { uploadImage, searchPortfolios, getMyPortfolio } = require('../controllers/portfolioController');

// Route to upload an image
router.post('/upload', uploadImage);

// Route to search for portfolios
router.get('/search', searchPortfolios);
router.get('/myportfolio', getMyPortfolio);


module.exports = router;
