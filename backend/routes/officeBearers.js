const express = require('express');
const multer = require('multer');
const router = express.Router();
const OfficeBearer = require('../models/OfficeBearer');
const googleDriveService = require('../services/googleDrive');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/office-bearers - Get all office bearers with year filtering
router.get('/', async (req, res) => {
  try {
    const { year, isCurrent, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (isCurrent !== undefined) {
      query.isCurrent = isCurrent === 'true';
    }

    const officeBearers = await OfficeBearer.find(query)
      .sort({ order: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await OfficeBearer.countDocuments(query);
    
    // Return direct array for admin compatibility
    res.json(officeBearers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/office-bearers/years - Get all available years
router.get('/years', async (req, res) => {
  try {
    const years = await OfficeBearer.distinct('year');
    res.json(years.sort((a, b) => b - a));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/office-bearers/:id - Get single office bearer
router.get('/:id', async (req, res) => {
  try {
    const officeBearer = await OfficeBearer.findById(req.params.id);
    if (!officeBearer) {
      return res.status(404).json({ error: 'Office bearer not found' });
    }
    res.json(officeBearer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/office-bearers - Create new office bearer (Admin only)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const officeBearerData = { ...req.body };
    
    // Handle photo upload to Google Drive
    if (req.file) {
      try {
        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `office-bearer-${timestamp}-${req.file.originalname}`;
        
        // Upload to Google Drive (office-bearers folder)
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'office-bearer'
        );
        
        officeBearerData.photo = uploadResult.id;
        console.log('Office bearer photo uploaded to Google Drive:', uploadResult.id);
      } catch (driveError) {
        console.error('Google Drive upload failed:', driveError.message);
        // Don't store invalid local filenames - just skip the photo
        console.log('Skipping photo upload due to Google Drive error - office bearer will be created without photo');
        // Remove photo field to create without photo
        delete officeBearerData.photo;
      }
    }
    
    const officeBearer = new OfficeBearer(officeBearerData);
    await officeBearer.save();
    res.status(201).json(officeBearer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/office-bearers/:id - Update office bearer (Admin only)
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle photo upload to Google Drive
    if (req.file) {
      try {
        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `office-bearer-${timestamp}-${req.file.originalname}`;
        
        // Upload to Google Drive (office-bearers folder)
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'office-bearer'
        );
        
        updateData.photo = uploadResult.id;
        console.log('Office bearer photo updated in Google Drive:', uploadResult.id);
      } catch (driveError) {
        console.error('Google Drive upload failed:', driveError.message);
        // Don't store invalid local filenames - just skip the photo update
        console.log('Skipping photo update due to Google Drive error - existing photo will be kept');
        // Remove photo field to keep existing photo
        delete updateData.photo;
      }
    }
    
    const officeBearer = await OfficeBearer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!officeBearer) {
      return res.status(404).json({ error: 'Office bearer not found' });
    }
    res.json(officeBearer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/office-bearers/:id - Delete office bearer (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const officeBearer = await OfficeBearer.findByIdAndDelete(req.params.id);
    if (!officeBearer) {
      return res.status(404).json({ error: 'Office bearer not found' });
    }
    res.json({ message: 'Office bearer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
