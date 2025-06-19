// middleware/complianceLogger.js
// This middleware is responsible for logging incoming request details for compliance and auditing purposes.

const fs = require('fs'); // Node.js File System module for interacting with the file system.
const path = require('path'); // Node.js Path module for handling and transforming file paths.

// Define the absolute path to the compliance log file.
// Logs will be stored in a 'logs' directory at the root of the project.
const logFilePath = path.join(__dirname, '../logs/compliance.log');

// Ensure the 'logs' directory exists. If not, create it recursively.
// This prevents errors if the application tries to write a log file before the directory is created.
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true }); // `recursive: true` creates parent directories if they don't exist.
}

/**
 * Express middleware function to log request details.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object (not directly used for logging here, but part of middleware signature).
 * @param {function} next - The callback function to pass control to the next middleware in the stack.
 */
const complianceLogger = (req, res, next) => {
  // Construct an object containing the data to be logged.
  const logData = {
    timestamp: new Date().toISOString(), // ISO 8601 format timestamp for consistency.
    method: req.method, // HTTP method of the request (e.g., GET, POST).
    url: req.originalUrl, // Full URL requested by the client, including query parameters.
    ip: req.ip, // Remote IP address of the client. (Note: may need `app.set('trust proxy', true)` if behind a proxy)
    userAgent: req.get('User-Agent'), // User-Agent header from the request.
    body: req.body, // Request body. IMPORTANT: Be extremely cautious logging the entire body,
                    // as it may contain sensitive Personally Identifiable Information (PII) or credentials.
                    // Consider redacting or logging only specific, non-sensitive fields.
    // Example of logging a specific field related to consent, assuming it's in the request body.
    // This is highly application-specific.
    consentGiven: req.body.consent // Assumes a boolean field `consent` like `{ consent: true }` might be present.
  };

  // Convert the log data object to a JSON string. Each log entry will be a single line.
  const logString = JSON.stringify(logData) + '\n';

  // Append the log string to the compliance log file asynchronously.
  // Using `appendFile` is generally safe for concurrent requests.
  fs.appendFile(logFilePath, logString, (err) => {
    if (err) {
      // If an error occurs during logging, print it to the console.
      // In a production environment, consider more robust error handling for logging failures.
      console.error('Failed to write to compliance log:', err);
    }
  });

  // Pass control to the next middleware function in the Express stack.
  // This is crucial; otherwise, the request will hang.
  next();
};

// Export the middleware function to be used in `app.js`.
module.exports = complianceLogger;
