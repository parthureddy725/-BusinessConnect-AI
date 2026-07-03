const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String
  },
  stage: {
    type: String,
    enum: ['Planning', 'Design', 'Development', 'Testing', 'Completed'],
    default: 'Planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estimatedCompletion: {
    type: String
  },
  timeline: [{
    stage: String,
    date: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  invoices: [{
    type: String // References Invoice IDs
  }]
}, {
  timestamps: true
});

module.exports = getModel('Project', ProjectSchema);
