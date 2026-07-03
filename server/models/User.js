const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  profile: {
    company: String,
    phone: String,
    avatar: String
  }
}, {
  timestamps: true
});

module.exports = getModel('User', UserSchema);
