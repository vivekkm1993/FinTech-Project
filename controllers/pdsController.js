// controllers/pdsController.js
// This file contains controller functions for managing Product Disclosure Statements (PDS).

const path = require('path'); // Node.js Path module for working with file and directory paths.
const fs = require('fs'); // Node.js File System module for interacting with the file system.

// Define the base directory where PDS documents are stored.
// `__dirname` is the directory of the current module (i.e., 'controllers').
// `path.join` creates a platform-independent path.
// For this example, PDS documents are assumed to be in a 'pds_documents' folder at the project root.
// In a production application, this path might be configurable via environment variables.
const PDS_DIRECTORY = path.join(__dirname, '..', 'pds_documents');

// --- Initial Setup: Ensure PDS directory and a sample PDF exist ---
// This block runs when the server starts.
// It creates the PDS_DIRECTORY if it doesn't already exist.
if (!fs.existsSync(PDS_DIRECTORY)) {
  fs.mkdirSync(PDS_DIRECTORY, { recursive: true }); // `recursive: true` creates parent directories if needed.
  console.log(`PDS directory created: ${PDS_DIRECTORY}`);
}
// Create a dummy 'sample_pds.pdf' file within the PDS_DIRECTORY for testing purposes if it's not there.
// This helps ensure that the API endpoints can be tested even without actual PDS documents.
const dummyPdfPath = path.join(PDS_DIRECTORY, 'sample_pds.pdf');
if (!fs.existsSync(dummyPdfPath)) {
  fs.writeFileSync(dummyPdfPath, 'This is a dummy PDF file created for testing the PDS serving functionality.');
  console.log(`Dummy PDS file created: ${dummyPdfPath}`);
}
// --- End of Initial Setup ---

/**
 * Controller function to serve a specific PDS PDF file.
 * @param {object} req - Express request object. `req.params.filename` contains the requested filename.
 * @param {object} res - Express response object.
 */
exports.servePds = (req, res) => {
  const { filename } = req.params; // Extract the filename from URL parameters.

  // **Security Note**: Basic filename sanitization to prevent directory traversal attacks.
  // This regex allows alphanumeric characters, hyphens, underscores, periods, and ensures the file ends with '.pdf'.
  // For more robust security, consider using a whitelist of allowed filenames or storing files with non-guessable names.
  if (!/^[a-zA-Z0-9_.-]+\.pdf$/.test(filename)) {
    return res.status(400).json({ message: 'Invalid filename format. Only .pdf files with alphanumeric, hyphen, underscore, or period characters are allowed.' });
  }

  // Construct the full, absolute path to the requested PDF file.
  const filePath = path.join(PDS_DIRECTORY, filename);

  // Check if the file exists at the constructed path.
  if (fs.existsSync(filePath)) {
    // Set appropriate HTTP headers for serving a PDF file.
    // 'Content-Type': 'application/pdf' tells the browser the type of content.
    res.setHeader('Content-Type', 'application/pdf');
    // 'Content-Disposition': 'inline' suggests the browser display the PDF inline if possible.
    // `filename="${filename}"` provides a default filename if the user chooses to save it.
    // Use 'attachment' instead of 'inline' to force download.
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Create a read stream from the file and pipe it to the response object.
    // This efficiently streams the file content to the client without loading the entire file into memory.
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, return a 404 Not Found response.
    res.status(404).json({ message: 'PDS document not found.' });
  }
};

/**
 * Controller function to list available PDS documents in the PDS_DIRECTORY. (Optional)
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.listPdsDocuments = (req, res) => {
  try {
    // Check if the PDS directory itself exists.
    if (!fs.existsSync(PDS_DIRECTORY)) {
      console.warn(`PDS directory not found when trying to list documents: ${PDS_DIRECTORY}`);
      // If the directory doesn't exist, it's not an error per se, but no documents are available.
      return res.status(200).json({
        message: 'PDS directory not found. No documents available at this time.',
        documents: [] // Return an empty list.
      });
    }

    // Read the contents of the PDS_DIRECTORY synchronously.
    // For very large directories, an asynchronous version (fs.readdir) might be preferred.
    const files = fs.readdirSync(PDS_DIRECTORY);

    // Filter the list to include only files ending with '.pdf'.
    // Map the filtered list to an array of objects, each containing the filename and a direct URL to access it.
    const pdfDocuments = files
      .filter(file => file.endsWith('.pdf')) // Keep only PDF files.
      .map(file => ({
        filename: file,
        // Optionally, add more metadata here if available (e.g., from a database, or parsed from filenames).
        // Example: product_name: file.replace('_pds.pdf', '').replace('_', ' ')
        url: `/api/pds/${file}` // Construct the API URL to access this specific PDF.
      }));

    // Respond with a 200 OK status and the list of available PDS documents.
    res.status(200).json({
      message: 'Available PDS documents.',
      documents: pdfDocuments,
    });
  } catch (error) {
    // If any error occurs during directory reading or processing, log it and return a 500 Internal Server Error.
    console.error('Error listing PDS documents:', error);
    res.status(500).json({ message: 'Failed to list PDS documents due to an internal server error.' });
  }
};
