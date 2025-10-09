const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  pdfFileId: {
    type: String,
    default: null
  },
  pdfName: {
    type: String,
    default: null
  },
  pdfViewUrl: {
    type: String,
    default: null
  },
  pdfDownloadUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);
