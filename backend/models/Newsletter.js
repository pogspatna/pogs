const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  fileUrl: {
    type: String, // Google Drive file ID
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'image'],
    default: 'pdf'
  },
  publishDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Newsletter', newsletterSchema); 