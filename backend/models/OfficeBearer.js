const mongoose = require('mongoose');

const officeBearerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },
  photo: {
    type: String, // Google Drive file ID
    required: false
  },
  year: {
    type: Number,
    required: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0 // Display order
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OfficeBearer', officeBearerSchema); 