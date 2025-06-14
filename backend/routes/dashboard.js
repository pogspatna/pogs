const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Event = require('../models/Event');
const MembershipApplication = require('../models/MembershipApplication');
const ContactInquiry = require('../models/ContactInquiry');

// GET /api/dashboard/stats - Get dashboard statistics (Admin only)
router.get('/stats', async (req, res) => {
  try {
    // Get counts
    const totalMembers = await Member.countDocuments({ status: 'Active' });
    const pendingApplications = await MembershipApplication.countDocuments({ status: 'Pending' });
    const totalEvents = await Event.countDocuments();
    const newInquiries = await ContactInquiry.countDocuments({ status: 'New' });

    // Get recent members (last 5)
    const recentMembers = await Member.find({ status: 'Active' })
      .sort({ dateJoined: -1 })
      .limit(5)
      .select('name address membershipType dateJoined');

    // Get upcoming events (next 3)
    const upcomingEvents = await Event.find({ 
      status: 'Upcoming',
      date: { $gte: new Date() }
    })
      .sort({ date: 1 })
      .limit(3)
      .select('name date location status');

    res.json({
      totalMembers,
      pendingApplications,
      totalEvents,
      newInquiries,
      recentMembers,
      upcomingEvents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 