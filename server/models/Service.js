const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  pricing: {
    type: String, // e.g. "$1,499 - Standard", or "Custom"
    required: true
  },
  image: {
    type: String,
    default: '/images/placeholder.jpg'
  },
  category: {
    type: String,
    default: 'Development'
  }
}, {
  timestamps: true
});

module.exports = getModel('Service', ServiceSchema);
