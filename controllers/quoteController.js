// controllers/quoteController.js
const Quote = require('../models/quoteModel'); // Will be created next
const omniLifeService = require('../services/omniLifeService'); // Will be created later

// Controller function to handle quote submission
exports.submitQuote = async (req, res) => {
  try {
    // 1. Validate input (basic example)
    const { name, email, productType, consent } = req.body;
    if (!name || !email || !productType) {
      return res.status(400).json({ message: 'Missing required fields: name, email, productType.' });
    }

    if (consent !== true && String(consent).toLowerCase() !== 'true') {
      return res.status(400).json({ message: 'Consent is required to proceed.' });
    }

    // 2. Basic Lead Capture (save to mock DB or actual DB)
    // For now, we'll use the mock model. In a real app, this would interact with MongoDB via Mongoose.
    const newQuoteLead = await Quote.create({
      name,
      email,
      productType,
      consentGiven: true, // Store consent
      status: 'pending_external_quote', // Initial status
      submittedAt: new Date(),
    });

    // 3. (Optional) Immediately try to get a quote from the external API
    // Or this could be a separate step/job
    let externalQuoteData = null;
    try {
      externalQuoteData = await omniLifeService.getQuoteFromOmniLife({ productType /* ...other params */ });
      // Update lead with external quote data if successful
      newQuoteLead.externalQuoteDetails = externalQuoteData;
      newQuoteLead.status = 'quote_received';
      // await newQuoteLead.save(); // If using a real DB model with save method
    } catch (apiError) {
      console.error('Failed to get quote from OmniLife immediately:', apiError.message);
      newQuoteLead.status = 'error_external_quote';
      // await newQuoteLead.save(); // If using a real DB model with save method
      // Decide if you want to return an error to the user or just log
    }

    // 4. Respond to the client
    res.status(201).json({
      message: 'Quote request received successfully.',
      leadId: newQuoteLead.id, // Or newQuoteLead._id if using MongoDB
      data: newQuoteLead,
      externalQuote: externalQuoteData // Include if fetched
    });

  } catch (error) {
    console.error('Error submitting quote:', error);
    // Log the detailed error for auditing, but don't expose it to the client
    // The complianceLogger will also pick up details if it's before this error handler in the middleware chain
    res.status(500).json({ message: 'Failed to submit quote request.' });
  }
};

// Controller function to test external API call
exports.testGetExternalQuote = async (req, res) => {
  try {
    // Example: Get a quote for a specific product type or use query params
    const productType = req.query.productType || 'default_product';

    const quoteData = await omniLifeService.getQuoteFromOmniLife({ productType });

    if (!quoteData) {
      return res.status(404).json({ message: 'Could not retrieve a quote from the external service.' });
    }

    res.status(200).json({
      message: 'External quote retrieved successfully.',
      data: quoteData,
    });

  } catch (error) {
    console.error('Error testing external quote service:', error);
    res.status(500).json({ message: 'Failed to retrieve quote from external service.', error: error.message });
  }
};
