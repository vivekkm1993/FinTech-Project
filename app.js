// Import necessary modules
const express = require('express');
const cors = require('cors');

// Import routes
const quoteRoutes = require('./routes/quoteRoutes');
// Placeholder for PDS routes (to be implemented later)
// const pdsRoutes = require('./routes/pdsRoutes');

// Import middleware
const complianceLogger = require('./middleware/complianceLogger'); // Will be created in a later step

// Initialize Express app
const app = express();

// Middleware setup
// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Compliance logging middleware (to be implemented)
app.use(complianceLogger);

// Mount API routes
app.use('/api/quotes', quoteRoutes); // Quote routes will be created in a later step
// Placeholder for PDS routes
// app.use('/api/pds', pdsRoutes);

// Basic error handling middleware (can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the app
module.exports = app;
