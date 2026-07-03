const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  downloadUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = getModel('Invoice', InvoiceSchema);
