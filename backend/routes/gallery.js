const express = require('express');
const router = express.Router();
const multer = require('multer');
const Gallery = require('../models/Gallery');
const googleDriveService = require('../services/googleDrive');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/gallery - Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { active = 'true', page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (active === 'true') {
      query.isActive = true;
    }

    const images = await Gallery.find(query)
      .sort({ uploadDate: -1, order: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Gallery.countDocuments(query);
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/gallery/dates - Get unique upload dates for chronological organization
router.get('/dates', async (req, res) => {
  try {
    const dates = await Gallery.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$uploadDate' },
            month: { $month: '$uploadDate' },
            day: { $dayOfMonth: '$uploadDate' }
          },
          date: { $first: '$uploadDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { date: -1 } },
      {
        $project: {
          _id: 0,
          date: '$date',
          count: '$count',
          formattedDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date'
            }
          }
        }
      }
    ]);

    res.json(dates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/gallery/by-date/:date - Get images by specific date
router.get('/by-date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const images = await Gallery.find({
      isActive: true,
      uploadDate: {
        $gte: targetDate,
        $lt: nextDate
      }
    }).sort({ uploadDate: -1, order: 1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/gallery/:id - Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/gallery - Upload new gallery image (Admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `gallery-${timestamp}-${req.file.originalname}`;
    
    // Upload to Google Drive (gallery folder)
    const uploadResult = await googleDriveService.uploadFile(
      req.file.buffer,
      fileName,
      req.file.mimetype,
      'gallery'
    );
    
    console.log('Gallery image uploaded to Google Drive:', uploadResult.id);
    
    // Create gallery entry
    const galleryData = {
      title: req.body.title || 'Untitled',
      description: req.body.description || '',
      imageUrl: uploadResult.id,
      category: req.body.category || 'General',
      order: parseInt(req.body.order) || 0
    };

    const galleryImage = new Gallery(galleryData);
    await galleryImage.save();
    
    res.status(201).json({
      message: 'Gallery image uploaded successfully',
      image: galleryImage
    });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image. Please check your file and try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/gallery/:id - Update gallery image (Admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    let updateData = {
      title: req.body.title || image.title,
      description: req.body.description || image.description,
      category: req.body.category || image.category,
      order: parseInt(req.body.order) || image.order,
      isActive: req.body.isActive !== undefined ? req.body.isActive === 'true' : image.isActive
    };

    // If new image is uploaded, replace the old one
    if (req.file) {
      const timestamp = Date.now();
      const fileName = `gallery-${timestamp}-${req.file.originalname}`;
      
      const uploadResult = await googleDriveService.uploadFile(
        req.file.buffer,
        fileName,
        req.file.mimetype,
        'gallery'
      );
      
      updateData.imageUrl = uploadResult.id;
      console.log('Gallery image updated in Google Drive:', uploadResult.id);
    }

    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Gallery image updated successfully',
      image: updatedImage
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/gallery/:id - Delete gallery image (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ 
      message: 'Gallery image deleted successfully',
      deletedImage: image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 