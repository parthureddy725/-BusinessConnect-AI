const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const TestimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/avatar-placeholder.png'
  },
  videoUrl: {
    type: String // Optional link to a mock video testimonial
  },
  approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = getModel('Testimonial', TestimonialSchema);
