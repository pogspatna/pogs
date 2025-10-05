const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  advisor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  chairperson: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  coChairperson: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0,
    min: 0,
    max: 9999
  }
}, {
  timestamps: true
});

// Index for search functionality
committeeSchema.index({ name: 'text', advisor: 'text', chairperson: 'text', coChairperson: 'text' });

module.exports = mongoose.model('Committee', committeeSchema);
