const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  membershipType: {
    type: String,
    enum: ['Life', 'Annual'],
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Index for search functionality
memberSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Member', memberSchema); 