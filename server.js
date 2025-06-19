// server.js - Main entry point for the Node.js application.

// Load environment variables from the .env file into process.env
require('dotenv').config();

// Import the configured Express application instance
const app = require('./app');

// Define the port for the server to listen on.
// Uses the PORT environment variable if set, otherwise defaults to 3000.
const PORT = process.env.PORT || 3000;

// Start the HTTP server and listen for incoming requests on the defined port.
app.listen(PORT, () => {
  // Log a message to the console once the server is successfully running.
  console.log(`Server is running on port ${PORT}`);
});
