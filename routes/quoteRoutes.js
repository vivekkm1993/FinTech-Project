// routes/quoteRoutes.js
// This file defines the routes related to quote management.
// These routes are mounted under the '/api/quotes' path in `app.js`.

const express = require('express');
const router = express.Router(); // Initialize an Express router instance.
const quoteController = require('../controllers/quoteController'); // Import the controller for handling quote logic.

// --- Define Routes ---

/**
 * @route   POST /api/quotes
 * @desc    Submit a new quote request.
 * @access  Public
 * @body    { name: string, email: string, productType: string, consent: boolean, ... } - Expected request body.
 */
router.post(
  '/', // The path for this route (relative to '/api/quotes').
  quoteController.submitQuote // Controller function to handle the request.
);

/**
 * @route   GET /api/quotes/test-external
 * @desc    Test endpoint for making a call to an external quoting service.
 *          Useful for development and debugging the external API integration.
 * @access  Public (or restricted, depending on requirements)
 * @query   { productType?: string } - Optional query parameters.
 */
router.get(
  '/test-external', // Path for testing external API calls.
  quoteController.testGetExternalQuote // Controller function to handle the test.
);

// Export the router to be used in `app.js`.
module.exports = router;
