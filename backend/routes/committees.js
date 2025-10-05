const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');

// Input sanitization helper
const sanitizeInput = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// GET /api/committees - Get all committees with filtering
router.get('/', async (req, res) => {
  try {
    const { active, search, page = 1, limit = 100 } = req.query;
    const query = {};
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { advisor: { $regex: search, $options: 'i' } },
        { chairperson: { $regex: search, $options: 'i' } },
        { coChairperson: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    const committees = await Committee.find(query)
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Committee.countDocuments(query);

    // Return direct array for admin compatibility (no pagination metadata for now)
    res.json(committees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/committees/:id - Get single committee
router.get('/:id', async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    res.json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/committees - Create new committee (Admin only)
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, advisor, chairperson, coChairperson } = req.body;
    if (!name || !advisor || !chairperson || !coChairperson) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, advisor, chairperson, and coChairperson are required' 
      });
    }

    const committee = new Committee(sanitizeInput(req.body));
    await committee.save();
    res.status(201).json(committee);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/committees/:id - Update committee (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const committee = await Committee.findByIdAndUpdate(
      req.params.id,
      sanitizeInput(req.body),
      { new: true, runValidators: true }
    );
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    res.json(committee);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/committees/:id - Delete committee (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const committee = await Committee.findByIdAndDelete(req.params.id);
    if (!committee) {
      return res.status(404).json({ error: 'Committee not found' });
    }
    res.json({ message: 'Committee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
