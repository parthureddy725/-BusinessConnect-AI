const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Technology'
  },
  author: {
    type: String,
    required: true,
    default: 'BusinessConnect AI Team'
  },
  image: {
    type: String,
    default: '/images/blog-placeholder.jpg'
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = getModel('Blog', BlogSchema);
