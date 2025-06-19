// models/quoteModel.js

// =====================================================================================
// !! MOCK DATABASE IMPLEMENTATION !!
// This file provides a mock Quote model for demonstration and development purposes.
// It uses an in-memory array to simulate database interactions.
// In a production environment, this should be replaced with a proper Mongoose model
// connected to a MongoDB database (see the Mongoose example below).
// =====================================================================================

const mockQuotesDB = []; // In-memory array acting as a "database" for quotes.
let currentId = 1; // Simple auto-incrementing ID for mock records.

/**
 * Represents a quote lead.
 * This class is part of the mock implementation.
 */
class Quote {
  /**
   * Constructor for a Quote instance.
   * @param {object} quoteData - Data for the new quote.
   * @param {string} quoteData.name - Name of the person requesting the quote.
   * @param {string} quoteData.email - Email of the person.
   * @param {string} quoteData.productType - Type of product for the quote.
   * @param {boolean} quoteData.consentGiven - Whether consent was provided.
   * @param {string} [quoteData.status='pending'] - Current status of the quote.
   * @param {Date} [quoteData.submittedAt=new Date()] - Timestamp of when the quote was submitted.
   * @param {object} [quoteData.externalQuoteDetails=null] - Details from an external quoting service.
   */
  constructor({ name, email, productType, consentGiven, status, submittedAt, externalQuoteDetails }) {
    this.id = currentId++; // Assign a unique ID and increment for the next one.
    this.name = name;
    this.email = email;
    this.productType = productType;
    this.consentGiven = consentGiven;
    this.status = status || 'pending'; // Default status if not provided.
    this.submittedAt = submittedAt || new Date(); // Default submission time if not provided.
    this.externalQuoteDetails = externalQuoteDetails || null; // Placeholder for external data.
    this.updatedAt = new Date(); // Timestamp for the last update.
  }

  /**
   * Mock static method to simulate creating and "saving" a new quote lead to the mock database.
   * @param {object} quoteData - The data for the quote to create.
   * @returns {Promise<Quote>} A promise that resolves with the newly created Quote instance.
   */
  static async create(quoteData) {
    const newQuote = new Quote(quoteData); // Create a new instance.
    mockQuotesDB.push(newQuote); // Add it to our in-memory array.
    console.log('Mock DB - Quote created:', newQuote); // Log for demonstration.
    return newQuote; // Return the created instance.
  }

  /**
   * Mock static method to simulate finding a quote by its ID in the mock database.
   * @param {number} id - The ID of the quote to find.
   * @returns {Promise<Quote|undefined>} A promise that resolves with the Quote instance if found, otherwise undefined.
   */
  static async findById(id) {
    // Ensure `id` is treated as a number for comparison if it comes as a string.
    const quote = mockQuotesDB.find(q => q.id === parseInt(id, 10));
    return quote;
  }

  /**
   * Mock instance method to simulate "saving" an updated Quote instance.
   * In this mock implementation, it primarily updates the `updatedAt` timestamp.
   * @returns {Promise<Quote>} A promise that resolves with the updated Quote instance (this).
   */
  async save() {
    this.updatedAt = new Date(); // Update the timestamp.
    console.log('Mock DB - Quote saved (updated):', this); // Log for demonstration.
    // In a real DB, this would persist changes to the record. Here, the object in mockQuotesDB is already updated by reference.
    return this;
  }
}

// =====================================================================================
// !! MONGOOSE MODEL EXAMPLE !!
// The following is a commented-out example of how this model would be typically
// defined using Mongoose for MongoDB. This provides a clear path for transitioning
// to a persistent database solution.
// =================================Mongoose Example=====================================
/*
const mongoose = require('mongoose');

// Define the schema for the 'Quote' collection in MongoDB.
const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'] // Field is required, custom error message.
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    lowercase: true, // Convert email to lowercase before saving.
    trim: true, // Remove whitespace from both ends of the string.
    // Basic email validation (more robust validation might be needed).
    // match: [/\S+@\S+\.\S+/, 'Email is invalid.']
  },
  productType: {
    type: String,
    required: [true, 'Product type is required.']
  },
  consentGiven: {
    type: Boolean,
    required: [true, 'Consent status is required.']
  },
  status: {
    type: String,
    // Define an enum for allowed status values.
    enum: ['pending_external_quote', 'quote_received', 'error_external_quote', 'completed', 'archived'],
    default: 'pending_external_quote' // Default status when a new quote is created.
  },
  // Store arbitrary data returned from the external API.
  // Using mongoose.Schema.Types.Mixed allows for flexibility but should be used judiciously.
  externalQuoteDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  submittedAt: {
    type: Date,
    default: Date.now // Automatically set to the current timestamp when a document is created.
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mongoose middleware: `pre('save')` hook.
// This function will run before any document of this schema is saved.
// It's used here to automatically update the `updatedAt` timestamp.
quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now(); // Set `updatedAt` to the current time.
  next(); // Continue with the save operation.
});

// Create the Mongoose model from the schema.
// The first argument is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural, lowercased version of your model name (e.g., 'quotes').
module.exports = mongoose.model('Quote', quoteSchema);
*/
// ============================End of Mongoose Example==================================

// Export the mock Quote class for use in controllers.
// When transitioning to Mongoose, you would export `mongoose.model('Quote', quoteSchema)` instead.
module.exports = Quote;
