// services/omniLifeService.js
const axios = require('axios');

// Base URL for the Omni Life API (replace with the actual API endpoint)
const OMNI_LIFE_API_BASE_URL = process.env.OMNI_LIFE_API_URL || 'https://api.omnilife.com/v1/calculator'; // Example
const API_KEY = process.env.OMNI_LIFE_API_KEY;

/**
 * Fetches a quote from the Omni Life API.
 *
 * @param {object} quoteParams Parameters for the quote calculation
 *                               (e.g., { productType, age, coverageAmount })
 * @returns {Promise<object>} The quote data from the external API.
 * @throws {Error} If the API call fails or returns an error.
 */
const getQuoteFromOmniLife = async (quoteParams) => {
  if (!API_KEY) {
    console.error('Omni Life API Key is missing. Please set OMNI_LIFE_API_KEY in .env');
    // Depending on requirements, either throw an error or return a mock/error response
    // For now, let's return a mock error structure to avoid breaking the flow entirely if key is missing during dev
    return {
      error: true,
      message: 'API key for OmniLife service is not configured.',
      details: 'Service cannot connect to OmniLife without an API key.'
    };
    // throw new Error('Omni Life API Key is missing.');
  }

  // Construct the request URL (this is an example, adjust as per actual API)
  // const requestUrl = `${OMNI_LIFE_API_BASE_URL}/calculate`; // Or whatever the endpoint is

  // For this example, let's assume the API expects productType in the query
  // This is highly dependent on the actual Omni Life API structure
  const requestUrl = `${OMNI_LIFE_API_BASE_URL}?product=${quoteParams.productType || 'default'}`;

  console.log(`Calling Omni Life API: ${requestUrl} with params:`, quoteParams);

  try {
    // Make the API call
    // The actual structure of the request (params, body, headers) will depend on Omni Life's API docs
    const response = await axios.get(requestUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`, // Common authorization header
        'Content-Type': 'application/json',
      },
      // params: quoteParams // If API expects params in query string for GET
      // data: quoteParams // If API expects data in body for POST/PUT
    });

    // Check for successful response
    if (response.status === 200 && response.data) {
      console.log('Successfully fetched quote from Omni Life:', response.data);
      // You might want to transform or select specific parts of the response
      return response.data;
    } else {
      // Handle non-successful responses that don't throw an error
      console.error('Omni Life API responded with status:', response.status, response.data);
      throw new Error(`Omni Life API responded with status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error calling Omni Life API:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Omni Life API Error Response Data:', error.response.data);
      console.error('Omni Life API Error Response Status:', error.response.status);
      console.error('Omni Life API Error Response Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Omni Life API No Response:', error.request);
    }
    // Rethrow or handle as appropriate for your application
    // Adding a more user-friendly error message might be good
    throw new Error(`Failed to retrieve quote from Omni Life service. ${error.message}`);
  }
};

module.exports = {
  getQuoteFromOmniLife,
};
