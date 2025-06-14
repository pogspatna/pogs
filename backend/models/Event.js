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
    required: true,
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 