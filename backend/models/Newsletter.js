const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  pdfUrl: {
    type: String, // Google Drive file ID
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Newsletter', newsletterSchema); 