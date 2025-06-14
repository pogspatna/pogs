const express = require('express');
const router = express.Router();
const multer = require('multer');
const MembershipApplication = require('../models/MembershipApplication');
const Member = require('../models/Member');
const OfflineForm = require('../models/OfflineForm');
const googleDriveService = require('../services/googleDrive');

// Configure multer for image uploads (payment screenshots)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Configure multer for PDF uploads (offline forms)
const pdfUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// GET /api/membership-applications - Get all applications (Admin only)
router.get('/', async (req, res) => {
  try {
    const applications = await MembershipApplication.find()
      .sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/membership-applications/offline-form - Get offline form info
router.get('/offline-form', async (req, res) => {
  try {
    const offlineForm = await OfflineForm.findOne({ isActive: true }).sort({ uploadDate: -1 });
    
    if (offlineForm) {
      res.json({ 
        available: true, 
        fileId: offlineForm.fileId,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${offlineForm.fileId}`
      });
    } else {
      res.json({ available: false });
    }
  } catch (error) {
    console.error('Error in offline form route:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/membership-applications/offline-form - Upload offline form PDF (Admin only)
router.post('/offline-form', pdfUpload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    try {
      const timestamp = Date.now();
      const fileName = `membership-application-form-${timestamp}.pdf`;
      
      // Upload to Google Drive (general folder)
      const uploadResult = await googleDriveService.uploadFile(
        req.file.buffer,
        fileName,
        req.file.mimetype,
        'general'
      );
      
      console.log('Offline form PDF uploaded to Google Drive:', uploadResult.id);
      
      // Deactivate previous forms
      await OfflineForm.updateMany({}, { isActive: false });
      
      // Save new form to database
      const offlineForm = new OfflineForm({
        fileId: uploadResult.id,
        fileName: fileName,
        isActive: true
      });
      await offlineForm.save();
      
      res.json({ 
        message: 'Offline form uploaded successfully',
        fileId: uploadResult.id,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${uploadResult.id}`
      });
    } catch (driveError) {
      console.error('Google Drive upload failed:', driveError.message);
      return res.status(500).json({ 
        error: 'Failed to upload PDF. Please check your file and try again.' 
      });
    }
  } catch (error) {
    console.error('Error uploading offline form:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/membership-applications - Submit new application
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    let paymentScreenshotId = null;
    
    if (req.file) {
      try {
        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `payment-screenshot-${timestamp}-${req.file.originalname}`;
        
        // Upload to Google Drive (payment-screenshots folder)
        const uploadResult = await googleDriveService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          'payment-screenshot'
        );
        
        paymentScreenshotId = uploadResult.id;
        console.log('Payment screenshot uploaded to Google Drive:', uploadResult.id);
      } catch (driveError) {
        console.error('Google Drive upload failed:', driveError.message);
        return res.status(500).json({ 
          error: 'Failed to upload payment screenshot. Please check your file and try again.' 
        });
      }
    } else {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    const applicationData = {
      ...req.body,
      paymentScreenshot: paymentScreenshotId,
      dateOfBirth: new Date(req.body.dateOfBirth)
    };

    const application = new MembershipApplication(applicationData);
    await application.save();
    
    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/membership-applications/:id - Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await MembershipApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/membership-applications/:id/approve - Approve application (Admin only)
router.post('/:id/approve', async (req, res) => {
  try {
    const { adminEmail } = req.body;
    
    const application = await MembershipApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({ error: 'Application already processed' });
    }

    // Update application status
    application.status = 'Approved';
    application.processedAt = new Date();
    application.processedBy = adminEmail || 'admin@pogs.com';
    await application.save();

    // Create new member
    const member = new Member({
      name: application.name,
      address: application.address,
      membershipType: application.membershipType,
      dateJoined: new Date()
    });
    await member.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/membership-applications/:id/reject - Reject application (Admin only)
router.post('/:id/reject', async (req, res) => {
  try {
    const { adminEmail, rejectionReason } = req.body;
    
    const application = await MembershipApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({ error: 'Application already processed' });
    }

    // Update application status
    application.status = 'Rejected';
    application.processedAt = new Date();
    application.processedBy = adminEmail || 'admin@pogs.com';
    application.rejectionReason = rejectionReason;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/membership-applications/:id - Delete application (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const application = await MembershipApplication.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
