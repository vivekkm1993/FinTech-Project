// routes/quoteRoutes.js
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController'); // Will be created next

// POST /api/quotes - Submit a new quote request
router.post('/', quoteController.submitQuote);

// GET /api/quotes/test-external - Test endpoint for external API call (optional, for development)
router.get('/test-external', quoteController.testGetExternalQuote); // Controller method to be added

module.exports = router;
