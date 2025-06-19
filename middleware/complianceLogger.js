// middleware/complianceLogger.js

const fs = require('fs');
const path = require('path');

// Define the log file path (ensure logs directory exists or handle creation)
const logFilePath = path.join(__dirname, '../logs/compliance.log');

// Ensure log directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const complianceLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body, // Be cautious logging entire body, especially with sensitive data
    consentGiven: req.body.consent // Assuming consent is passed in the body like { consent: true }
  };

  // Convert log data to string
  const logString = JSON.stringify(logData) + '\n';

  // Append to log file
  fs.appendFile(logFilePath, logString, (err) => {
    if (err) {
      console.error('Failed to write to compliance log:', err);
    }
  });

  // Continue to the next middleware or route handler
  next();
};

module.exports = complianceLogger;
