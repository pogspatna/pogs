const express = require('express');
const multer = require('multer');
const router = express.Router();
const Notice = require('../models/Notice');
const googleDriveService = require('../services/googleDrive');

// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// GET /api/notices - Active (not expired), newest first
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({ expiryDate: { $gte: now } })
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notices/all - All notices (admin use)
router.get('/all', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notices - Create notice
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { title, content, expiryDate } = req.body;
    if (!title || !content || !expiryDate) {
      return res.status(400).json({ error: 'title, content, and expiryDate are required' });
    }
    const noticeData = { title, content, expiryDate: new Date(expiryDate) };

    if (req.file) {
      try {
        const timestamp = Date.now();
        const fileName = `notice-${timestamp}-${req.file.originalname}`;
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'notice'
        );
        noticeData.pdfFileId = uploadResult.id;
        noticeData.pdfName = uploadResult.name || req.file.originalname;
        noticeData.pdfViewUrl = googleDriveService.getDirectViewUrl(uploadResult.id);
        noticeData.pdfDownloadUrl = googleDriveService.getDirectDownloadUrl(uploadResult.id);
      } catch (driveError) {
        return res.status(500).json({ error: 'Failed to upload PDF to Google Drive' });
      }
    }

    const notice = new Notice(noticeData);
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/notices/:id - Update notice
router.put('/:id', upload.single('pdf'), async (req, res) => {
  try {
    const { title, content, expiryDate } = req.body;
    const update = {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(expiryDate !== undefined ? { expiryDate: new Date(expiryDate) } : {}),
    };

    if (req.file) {
      try {
        // If replacing file, attempt to delete old one
        const existing = await Notice.findById(req.params.id);
        if (existing && existing.pdfFileId) {
          try { await googleDriveService.deleteFile(existing.pdfFileId); } catch (_) {}
        }
        const timestamp = Date.now();
        const fileName = `notice-${timestamp}-${req.file.originalname}`;
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'notice'
        );
        update.pdfFileId = uploadResult.id;
        update.pdfName = uploadResult.name || req.file.originalname;
        update.pdfViewUrl = googleDriveService.getDirectViewUrl(uploadResult.id);
        update.pdfDownloadUrl = googleDriveService.getDirectDownloadUrl(uploadResult.id);
      } catch (driveError) {
        return res.status(500).json({ error: 'Failed to upload PDF to Google Drive' });
      }
    }

    const notice = await Notice.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/notices/:id - Delete notice
router.delete('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    // Best-effort cleanup of attached PDF
    if (notice.pdfFileId) {
      try { await googleDriveService.deleteFile(notice.pdfFileId); } catch (_) {}
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
