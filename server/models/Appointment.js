const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const AppointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  timeSlot: {
    type: String, // e.g. "10:00 AM - 11:00 AM"
    required: true
  },
  budget: {
    type: String, // e.g. "$5k - $10k"
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = getModel('Appointment', AppointmentSchema);
