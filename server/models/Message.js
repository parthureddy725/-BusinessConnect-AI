const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const MessageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  reply: {
    type: String // Optional response sent by Admin
  }
}, {
  timestamps: true
});

module.exports = getModel('Message', MessageSchema);
