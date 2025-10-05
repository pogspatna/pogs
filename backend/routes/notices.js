const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

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
router.post('/', async (req, res) => {
  try {
    const { title, content, expiryDate } = req.body;
    if (!title || !content || !expiryDate) {
      return res.status(400).json({ error: 'title, content, and expiryDate are required' });
    }
    const notice = new Notice({ title, content, expiryDate: new Date(expiryDate) });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/notices/:id - Update notice
router.put('/:id', async (req, res) => {
  try {
    const { title, content, expiryDate } = req.body;
    const update = {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(expiryDate !== undefined ? { expiryDate: new Date(expiryDate) } : {}),
    };
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
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
