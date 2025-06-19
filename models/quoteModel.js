// models/quoteModel.js

// This is a mock database/model for demonstration purposes.
// In a real application, you would use Mongoose here to define a schema and model for MongoDB.

const mockQuotesDB = []; // Our in-memory "database"
let currentId = 1;

class Quote {
  constructor({ name, email, productType, consentGiven, status, submittedAt, externalQuoteDetails }) {
    this.id = currentId++;
    this.name = name;
    this.email = email;
    this.productType = productType;
    this.consentGiven = consentGiven;
    this.status = status || 'pending';
    this.submittedAt = submittedAt || new Date();
    this.externalQuoteDetails = externalQuoteDetails || null;
    this.updatedAt = new Date();
  }

  // Mock static method to "create" a new quote lead
  static async create(quoteData) {
    const newQuote = new Quote(quoteData);
    mockQuotesDB.push(newQuote);
    console.log('Mock DB - Quote created:', newQuote);
    return newQuote;
  }

  // Mock static method to "find" a quote by ID (optional, for future use)
  static async findById(id) {
    const quote = mockQuotesDB.find(q => q.id === parseInt(id));
    return quote;
  }

  // Mock instance method to "save" (useful if you were to update an instance)
  // In this mock, it just updates the updatedAt timestamp
  async save() {
    this.updatedAt = new Date();
    console.log('Mock DB - Quote saved (updated):', this);
    return this;
  }
}

/*
// Example of how you might structure it with Mongoose:
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  productType: { type: String, required: true },
  consentGiven: { type: Boolean, required: true },
  status: {
    type: String,
    enum: ['pending_external_quote', 'quote_received', 'error_external_quote', 'completed'],
    default: 'pending_external_quote'
  },
  externalQuoteDetails: { type: mongoose.Schema.Types.Mixed }, // To store whatever the external API returns
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update `updatedAt` field before saving
quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Quote', quoteSchema);
*/

module.exports = Quote; // Exporting the mock class
