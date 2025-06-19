// services/omniLifeService.js
// This service encapsulates the logic for interacting with the external Omni Life API.

const axios = require('axios'); // HTTP client for making API requests.

// Retrieve the base URL for the Omni Life API from environment variables.
// Fallback to a default example URL if not set.
// !! IMPORTANT: Replace 'https://api.omnilife.com/v1/calculator' with the actual API endpoint.
const OMNI_LIFE_API_BASE_URL = process.env.OMNI_LIFE_API_URL || 'https://api.omnilife.com/v1/calculator'; // Example URL

// Retrieve the API key for the Omni Life API from environment variables.
const API_KEY = process.env.OMNI_LIFE_API_KEY;

/**
 * Fetches a quote from the external Omni Life API.
 *
 * @async
 * @param {object} quoteParams - Parameters required for the quote calculation by the Omni Life API.
 *                               Example: { productType: 'TERM_LIFE', age: 30, coverageAmount: 500000 }
 *                               The actual parameters will depend on the Omni Life API's requirements.
 * @returns {Promise<object>} A promise that resolves to the quote data from the external API.
 *                            The structure of this object is dictated by the Omni Life API response.
 * @throws {Error} If the API key is missing, the API call fails, or the API returns an error status.
 */
const getQuoteFromOmniLife = async (quoteParams) => {
  // Check if the API key is configured.
  if (!API_KEY) {
    console.error('Omni Life API Key is missing. Please set OMNI_LIFE_API_KEY in .env file.');
    // For development, returning an error object can be helpful to avoid breaking the entire flow.
    // In production, throwing an error might be more appropriate to signal a critical configuration issue.
    return {
      error: true,
      message: 'API key for OmniLife service is not configured.',
      details: 'The service cannot connect to the OmniLife API without a valid API key. Please check server configuration.'
    };
    // Alternatively, throw an error:
    // throw new Error('Omni Life API Key is missing. Service cannot operate.');
  }

  // Construct the request URL.
  // !! IMPORTANT: This is a placeholder and needs to be adapted based on the Omni Life API documentation.
  // It might involve different path segments, query parameters, or even a different base URL per product.
  // Example: API might expect productType as part of the path or as a query parameter.
  // const requestUrl = `${OMNI_LIFE_API_BASE_URL}/calculate/${quoteParams.productType}`; // Path param example
  const requestUrl = `${OMNI_LIFE_API_BASE_URL}?product=${quoteParams.productType || 'default_product'}`; // Query param example

  console.log(`Calling Omni Life API: ${requestUrl} with params:`, JSON.stringify(quoteParams));

  try {
    // Make the API call using axios.
    // !! IMPORTANT: The HTTP method (GET, POST, etc.), headers, and how parameters are sent (query, body)
    // must align with the Omni Life API's specifications.
    const response = await axios.get(requestUrl, {
      headers: {
        // 'Authorization': `Bearer ${API_KEY}`, // Common for Bearer token authentication.
        'X-API-Key': API_KEY, // Common for API key in header. Adjust as per API docs.
        'Content-Type': 'application/json', // Standard content type for JSON APIs.
      },
      // If the API expects parameters in the query string for a GET request:
      // params: quoteParams,
      // If the API expects parameters in the request body for a POST/PUT request:
      // data: quoteParams,
    });

    // Check for a successful HTTP response status (e.g., 200 OK).
    if (response.status === 200 && response.data) {
      console.log('Successfully fetched quote from Omni Life:', response.data);
      // The `response.data` is the payload from the Omni Life API.
      // You might need to transform or select specific parts of this data
      // before returning it to the controller.
      return response.data;
    } else {
      // Handle cases where the API responds with a non-200 status but doesn't throw an axios error.
      console.error(`Omni Life API responded with status: ${response.status}`, response.data);
      throw new Error(`Omni Life API responded with status: ${response.status}. Data: ${JSON.stringify(response.data)}`);
    }

  } catch (error) {
    // Handle errors during the API call (e.g., network issues, timeout, or error statuses like 4xx/5xx).
    console.error('Error calling Omni Life API:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range.
      console.error('Omni Life API Error Response Data:', error.response.data);
      console.error('Omni Life API Error Response Status:', error.response.status);
      console.error('Omni Life API Error Response Headers:', error.response.headers);
      // Propagate a more specific error based on the API's response.
      throw new Error(`Failed to retrieve quote from Omni Life service. Status: ${error.response.status}. Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error, DNS issue).
      console.error('Omni Life API No Response Received:', error.request);
      throw new Error('Failed to retrieve quote from Omni Life service: No response received from the external server.');
    }
    // For other types of errors (e.g., issues setting up the request).
    throw new Error(`Failed to retrieve quote from Omni Life service: ${error.message}`);
  }
};

// Export the service function(s).
module.exports = {
  getQuoteFromOmniLife,
};
