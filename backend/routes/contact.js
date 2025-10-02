const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');

// GET /api/contact - Get all contact inquiries (Admin only)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status && ['New', 'Responded'].includes(status)) {
      query.status = status;
    }

    const inquiries = await ContactInquiry.find(query)
      .sort({ createdAt: -1 });

    // Return direct array for admin compatibility
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contact/:id - Get single contact inquiry (Admin only)
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    const inquiry = new ContactInquiry({
      name,
      email,
      phone,
      message
    });
    
    await inquiry.save();
    
    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      inquiryId: inquiry._id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/contact/:id/respond - Mark inquiry as responded (Admin only)
router.post('/:id/respond', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'Responded' },
      { new: true, runValidators: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found' });
    }
    
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/contact/:id/status - Update inquiry status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['New', 'Responded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found' });
    }
    
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/contact/:id - Delete contact inquiry (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found' });
    }
    res.json({ message: 'Contact inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 