const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// GET /api/members - Get all members with search functionality
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await Member.find(query)
      .sort({ name: 1 });

    // Return direct array for admin compatibility
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// GET /api/members/:id - Get single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// POST /api/members - Create new member (Admin only)
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create member' });
  }
});

// PUT /api/members/:id - Update member (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update member' });
  }
});

// DELETE /api/members/:id - Delete member (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

module.exports = router; 