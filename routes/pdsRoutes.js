// routes/pdsRoutes.js
// This file defines the routes for accessing Product Disclosure Statement (PDS) documents.
// These routes are mounted under the '/api/pds' path in `app.js`.

const express = require('express');
const router = express.Router(); // Initialize an Express router instance.
const pdsController = require('../controllers/pdsController'); // Import the controller for PDS logic.

// --- Define PDS Routes ---

/**
 * @route   GET /api/pds/:filename
 * @desc    Serves a specific Product Disclosure Statement (PDS) PDF file.
 *          The `:filename` parameter in the URL specifies which PDS document to retrieve.
 * @access  Public (PDS documents are generally public)
 * @param   {string} req.params.filename - The filename of the PDS document to be served (e.g., "my_product_pds.pdf").
 */
router.get(
  '/:filename', // Route path with a dynamic parameter for the filename.
  pdsController.servePds // Controller function to handle serving the PDS file.
);

/**
 * @route   GET /api/pds
 * @desc    (Optional) Lists all available Product Disclosure Statement (PDS) documents.
 *          This can provide a way for clients to discover available PDS files.
 * @access  Public
 */
router.get(
  '/', // Base path for listing PDS documents (relative to '/api/pds').
  pdsController.listPdsDocuments // Controller function to handle listing PDS documents.
);

// Export the router to be used in `app.js`.
module.exports = router;
