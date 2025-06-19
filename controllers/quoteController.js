// controllers/quoteController.js
// This file contains controller functions for handling quote-related API requests.

// Import the mock Quote model. In a real application, this would be a Mongoose model.
const Quote = require('../models/quoteModel');
// Import the service for interacting with the OmniLife external API.
const omniLifeService = require('../services/omniLifeService');

/**
 * Controller function to handle new quote submissions.
 * @param {object} req - Express request object. Expected body contains name, email, productType, consent.
 * @param {object} res - Express response object.
 */
exports.submitQuote = async (req, res) => {
  try {
    // 1. Validate input from the request body.
    const { name, email, productType, consent } = req.body;
    if (!name || !email || !productType) {
      // If required fields are missing, return a 400 Bad Request response.
      return res.status(400).json({ message: 'Missing required fields: name, email, productType.' });
    }

    // Validate consent. Consent is crucial for compliance.
    // Handles both boolean `true` and string `"true"`.
    if (consent !== true && String(consent).toLowerCase() !== 'true') {
      return res.status(400).json({ message: 'Consent is required to proceed.' });
    }

    // 2. Capture the lead information.
    // This uses the mock `Quote.create()` method. In a production environment,
    // this would typically involve saving the data to a MongoDB database via a Mongoose model.
    const newQuoteLead = await Quote.create({
      name,
      email,
      productType,
      consentGiven: true, // Explicitly store that consent was given.
      status: 'pending_external_quote', // Set an initial status for the lead.
      submittedAt: new Date(), // Timestamp of submission.
    });

    // 3. (Optional) Attempt to fetch a quote from the external OmniLife API immediately.
    // This could also be handled by a separate background job or a subsequent user action.
    let externalQuoteData = null;
    try {
      // Call the OmniLife service, passing necessary parameters (e.g., productType).
      // Additional parameters like age, coverage amount, etc., might be needed depending on the API.
      externalQuoteData = await omniLifeService.getQuoteFromOmniLife({ productType /* ...other relevant params */ });

      // If successful, update the lead with the external quote details and change its status.
      newQuoteLead.externalQuoteDetails = externalQuoteData;
      newQuoteLead.status = 'quote_received';
      // If using a real Mongoose model, you would save the changes:
      // await newQuoteLead.save();
    } catch (apiError) {
      // If the external API call fails, log the error and update the lead's status.
      console.error('Failed to get quote from OmniLife immediately:', apiError.message);
      newQuoteLead.status = 'error_external_quote';
      // await newQuoteLead.save(); // Persist status change if using a real DB.
      // Depending on business requirements, you might choose to inform the user about this failure
      // or handle it silently while still confirming lead capture.
    }

    // 4. Respond to the client.
    // Send a 201 Created status indicating successful resource creation (the quote lead).
    res.status(201).json({
      message: 'Quote request received successfully.',
      leadId: newQuoteLead.id, // Use newQuoteLead._id if using MongoDB's default ObjectId.
      data: newQuoteLead, // The created lead data.
      externalQuote: externalQuoteData // Include the external quote data if it was fetched.
    });

  } catch (error) {
    // Catch any unexpected errors during the process.
    console.error('Error submitting quote:', error);
    // The complianceLogger (if placed before this in app.js) should have already logged request details.
    // Avoid exposing detailed error messages to the client in production.
    res.status(500).json({ message: 'Failed to submit quote request.' });
  }
};

/**
 * Controller function to test the external OmniLife API call.
 * Useful for development and debugging.
 * @param {object} req - Express request object. Can accept `productType` as a query parameter.
 * @param {object} res - Express response object.
 */
exports.testGetExternalQuote = async (req, res) => {
  try {
    // Get `productType` from query parameters, or use a default value for testing.
    const productType = req.query.productType || 'default_product_for_testing';

    // Call the OmniLife service to get a quote.
    const quoteData = await omniLifeService.getQuoteFromOmniLife({ productType });

    // If the service returns no data (e.g., API key missing, or API returns empty for other reasons),
    // respond with a 404 or appropriate status.
    if (!quoteData || (quoteData.error && quoteData.message === 'API key for OmniLife service is not configured.')) {
      // Specific check for API key missing, could return 503 Service Unavailable or 400 Bad Request
      if (quoteData && quoteData.error) return res.status(503).json({ message: quoteData.message, details: quoteData.details });
      return res.status(404).json({ message: 'Could not retrieve a quote from the external service (productType may be invalid or service unavailable).' });
    }
     if (quoteData.error) { // Catch other errors returned by the service itself
        return res.status(500).json({ message: quoteData.message, details: quoteData.details });
    }


    // If successful, return the quote data.
    res.status(200).json({
      message: 'External quote retrieved successfully.',
      data: quoteData,
    });

  } catch (error) {
    // Catch errors from the omniLifeService call (e.g., network issues, API errors).
    console.error('Error testing external quote service:', error);
    // Provide a more specific error message if possible, or the generic one from the error object.
    res.status(500).json({ message: 'Failed to retrieve quote from external service.', error: error.message });
  }
};
