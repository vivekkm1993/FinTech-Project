// Load environment variables from .env file
require('dotenv').config();

// Import the Express application
const app = require('./app');

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
