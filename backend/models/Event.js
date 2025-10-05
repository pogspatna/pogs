const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  detailedDescription: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Past'],
    default: 'Upcoming'
  },
  image: {
    type: String, // Google Drive file ID for event image
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 