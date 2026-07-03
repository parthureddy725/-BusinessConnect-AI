const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String, // e.g. 'project', 'appointment', 'invoice', 'system'
    default: 'system'
  }
}, {
  timestamps: true
});

module.exports = getModel('Notification', NotificationSchema);
