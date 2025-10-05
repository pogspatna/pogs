const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// API Routes
try {
  app.use('/api/members', require('./routes/members'));
  app.use('/api/events', require('./routes/events'));
  app.use('/api/office-bearers', require('./routes/officeBearers'));
  app.use('/api/newsletters', require('./routes/newsletters'));
  app.use('/api/membership-applications', require('./routes/membershipApplications'));
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/contact-inquiries', require('./routes/contact')); // Alias for admin compatibility
  app.use('/api/dashboard', require('./routes/dashboard'));
  app.use('/api/gallery', require('./routes/gallery'));
  app.use('/api/committees', require('./routes/committees'));
  app.use('/api/notices', require('./routes/notices'));
} catch (error) {
  // Log error for debugging but don't expose details
  if (process.env.NODE_ENV !== 'production') {
  console.error('Error loading routes:', error.message);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  // Log full error in development only
  if (process.env.NODE_ENV !== 'production') {
  console.error(err.stack);
  }
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pogs_db';
mongoose.connect(mongoUri)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
    console.log('Connected to MongoDB');
    }
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
      console.log(`Server is running on port ${PORT}`);
      }
    });
  })
  .catch((error) => {
    // Log error for debugging but don't expose details
    if (process.env.NODE_ENV !== 'production') {
    console.error('Database connection error:', error);
    }
  }); 