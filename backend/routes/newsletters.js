const express = require('express');
const multer = require('multer');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const googleDriveService = require('../services/googleDrive');

// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// GET /api/newsletters - Get all newsletters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const newsletters = await Newsletter.find()
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Newsletter.countDocuments();
    
    // Return direct array for admin compatibility
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/newsletters/:id - Get single newsletter
router.get('/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/newsletters - Create new newsletter (Admin only)
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const newsletterData = { ...req.body };
    
    // Handle PDF upload to Google Drive
    if (req.file) {
      try {
        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `newsletter-${timestamp}-${req.file.originalname}`;
        
        // Upload to Google Drive (newsletters folder)
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'newsletter'
        );
        
        newsletterData.pdfUrl = uploadResult.id;
        console.log('Newsletter PDF uploaded to Google Drive:', uploadResult.id);
      } catch (driveError) {
        console.error('Google Drive upload failed:', driveError.message);
        return res.status(500).json({ 
          error: 'Failed to upload PDF. Please check Google Drive configuration and try again.' 
        });
      }
    } else {
      return res.status(400).json({ error: 'PDF file is required' });
    }
    
    const newsletter = new Newsletter(newsletterData);
    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/newsletters/:id - Update newsletter (Admin only)
router.put('/:id', upload.single('pdf'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle PDF upload to Google Drive
    if (req.file) {
      try {
        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `newsletter-${timestamp}-${req.file.originalname}`;
        
        // Upload to Google Drive (newsletters folder)
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'newsletter'
        );
        
        updateData.pdfUrl = uploadResult.id;
        console.log('Newsletter PDF updated in Google Drive:', uploadResult.id);
      } catch (driveError) {
        console.error('Google Drive upload failed:', driveError.message);
        return res.status(500).json({ 
          error: 'Failed to upload PDF. Please check Google Drive configuration and try again.' 
        });
      }
    }
    
    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/newsletters/:id - Delete newsletter (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
