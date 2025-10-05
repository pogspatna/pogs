const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const multer = require('multer');
const googleDriveService = require('../services/googleDrive');

// Multer setup for event image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// GET /api/events - Get all events with status filtering
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status && ['Upcoming', 'Ongoing', 'Past'].includes(status)) {
      query.status = status;
    }

    const events = await Event.find(query)
      .sort({ date: -1 });

    // Return direct array for admin compatibility
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/events - Create new event (Admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageId = null;
    if (req.file) {
      try {
        const timestamp = Date.now();
        const fileName = `event-${timestamp}-${req.file.originalname}`;
        const uploadRes = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'event'
        );
        imageId = uploadRes.id;
      } catch (err) {
        return res.status(500).json({ error: 'Failed to upload event image' });
      }
    }

    const payload = {
      ...req.body,
      ...(imageId ? { image: imageId } : {}),
    };

    const event = new Event(payload);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/events/:id - Update event (Admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.file) {
      try {
        const timestamp = Date.now();
        const fileName = `event-${timestamp}-${req.file.originalname}`;
        const uploadRes = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'event'
        );
        update.image = uploadRes.id;
      } catch (err) {
        return res.status(500).json({ error: 'Failed to upload event image' });
      }
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/events/:id - Delete event (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 