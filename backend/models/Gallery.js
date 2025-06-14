const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String, // Google Drive file ID
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
gallerySchema.index({ uploadDate: -1 });
gallerySchema.index({ isActive: 1, uploadDate: -1 });

module.exports = mongoose.model('Gallery', gallerySchema); 