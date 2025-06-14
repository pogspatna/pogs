const mongoose = require('mongoose');

const offlineFormSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OfflineForm', offlineFormSchema); 