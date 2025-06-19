// app.js - Configures and exports the Express application instance.

// Import necessary core modules
const express = require('express'); // The Express framework
const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing

// Import application-specific route modules
const quoteRoutes = require('./routes/quoteRoutes'); // Routes for quote management
const pdsRoutes = require('./routes/pdsRoutes');   // Routes for Product Disclosure Statements

// Import custom middleware
const complianceLogger = require('./middleware/complianceLogger'); // Middleware for logging requests for compliance

// Initialize the Express application
const app = express();

// --- Middleware Setup ---

// Enable CORS for all origins and routes.
// This allows the frontend (potentially on a different domain) to make requests to this backend.
app.use(cors());

// Parse incoming requests with JSON payloads.
// Populates `req.body` with the parsed JSON object.
app.use(express.json());

// Parse incoming requests with URL-encoded payloads (e.g., from HTML forms).
// `extended: true` allows for rich objects and arrays to be encoded.
// Populates `req.body` with the parsed data.
app.use(express.urlencoded({ extended: true }));

// Use the custom compliance logging middleware for all incoming requests.
// This should be placed early in the middleware stack to log as much as possible.
app.use(complianceLogger);

// --- API Route Mounting ---

// Mount the quote-related routes under the '/api/quotes' path.
// All routes defined in `quoteRoutes.js` will be prefixed with '/api/quotes'.
app.use('/api/quotes', quoteRoutes);

// Mount the PDS-related routes under the '/api/pds' path.
// All routes defined in `pdsRoutes.js` will be prefixed with '/api/pds'.
app.use('/api/pds', pdsRoutes);

// --- Basic Error Handling Middleware ---

// A simple error-handling middleware that catches unhandled errors from preceding routes or middleware.
// For more robust error handling, consider specific error types and user-friendly messages.
app.use((err, req, res, next) => {
  // Log the full error stack to the console for debugging.
  console.error(err.stack);
  // Send a generic 500 Internal Server Error response to the client.
  res.status(500).send('Something broke!');
});

// Export the configured Express app instance to be used by `server.js` or for testing.
module.exports = app;
