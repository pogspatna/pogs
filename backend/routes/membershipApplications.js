const express = require('express');
const router = express.Router();
const multer = require('multer');
const MembershipApplication = require('../models/MembershipApplication');
const Member = require('../models/Member');
const OfflineForm = require('../models/OfflineForm');
const googleDriveService = require('../services/googleDrive');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

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
router.post('/', upload.fields([
  { name: 'paymentScreenshot', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), async (req, res) => {
  try {
    let paymentScreenshotId = null;
    let signatureId = null;
    // Generate a unique identifier per application for filenames and traceability
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    
    const paymentFile = req.files && Array.isArray(req.files['paymentScreenshot']) ? req.files['paymentScreenshot'][0] : null;
    const signatureFile = req.files && Array.isArray(req.files['signature']) ? req.files['signature'][0] : null;

    if (paymentFile) {
      try {
        // Upload payment screenshot
        const fileName = `membership-payment-${uid}-${paymentFile.originalname}`;
        
        const uploadResult = await googleDriveService.uploadFile(paymentFile.buffer, fileName, paymentFile.mimetype, 'payment-screenshot');
        
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

    if (signatureFile) {
      try {
        const sigName = `membership-signature-${uid}-${signatureFile.originalname}`;
        const sigUpload = await googleDriveService.uploadFile(signatureFile.buffer, sigName, signatureFile.mimetype, 'payment-screenshot');
        signatureId = sigUpload.id;
        console.log('Signature image uploaded to Google Drive:', signatureId);
      } catch (driveError) {
        console.error('Google Drive upload failed (signature):', driveError.message);
        return res.status(500).json({ 
          error: 'Failed to upload signature image. Please check your file and try again.' 
        });
      }
    } else {
      return res.status(400).json({ error: 'Signature image is required' });
    }

    const applicationData = {
      ...req.body,
      paymentScreenshot: paymentScreenshotId,
      signature: signatureId,
      applicationIdentifier: uid,
      dateOfBirth: new Date(req.body.dateOfBirth)
    };

    const application = new MembershipApplication(applicationData);

    // Generate PDF summary of application
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait in points
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const { width, height } = page.getSize();
      const margin = 50;
      const contentWidth = width - (2 * margin);

      let cursorY = height - margin;

      const drawText = (text, x, y, size = 12, bold = false, color = rgb(0, 0, 0)) => {
        page.drawText(text, { x, y, size, font: bold ? fontBold : font, color });
      };

      const drawLine = (x1, y1, x2, y2, color = rgb(0.8, 0.8, 0.8)) => {
        page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 1, color });
      };

      const drawSection = (title, y) => {
        // Section background
        page.drawRectangle({
          x: margin,
          y: y - 25,
          width: contentWidth,
          height: 25,
          color: rgb(0.95, 0.95, 0.95),
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1,
        });
        
        // Section title
        drawText(title, margin + 10, y - 15, 14, true, rgb(0.2, 0.2, 0.2));
        return y - 40;
      };

      // Header with single-line title
      page.drawRectangle({
        x: margin,
        y: cursorY - 40,
        width: contentWidth,
        height: 40,
        color: rgb(0.1, 0.2, 0.5),
      });
      
      const headerText = 'POGS — Patna Obstetrics & Gynaecological Society — Membership Application';
      drawText(headerText, margin + 15, cursorY - 27, 12, true, rgb(1, 1, 1));
      
      cursorY -= 70;

      // Application ID and Date
      drawText(`Application ID: ${uid}`, width - margin - 150, cursorY, 10, true, rgb(0.4, 0.4, 0.4));
      drawText(`Submitted: ${new Date().toLocaleDateString()}`, width - margin - 150, cursorY - 15, 10, false, rgb(0.4, 0.4, 0.4));
      cursorY -= 40;

      // Personal Information Section
      cursorY = drawSection('Personal Information', cursorY);
      
      const personalDetails = [
        ['Full Name', applicationData.name],
        ['Date of Birth', new Date(applicationData.dateOfBirth).toLocaleDateString()],
        ['Qualification', applicationData.qualification],
        ['Membership Type', applicationData.membershipType],
      ];

      personalDetails.forEach(([label, value]) => {
        drawText(`${label}:`, margin + 20, cursorY, 11, true);
        drawText(String(value || ''), margin + 200, cursorY, 11, false);
        cursorY -= 18;
      });

      cursorY -= 20;

      // Contact Information Section
      cursorY = drawSection('Contact Information', cursorY);
      
      const contactDetails = [
        ['Email Address', applicationData.email],
        ['Mobile Number', applicationData.mobile],
      ];

      contactDetails.forEach(([label, value]) => {
        drawText(`${label}:`, margin + 20, cursorY, 11, true);
        drawText(String(value || ''), margin + 200, cursorY, 11, false);
        cursorY -= 18;
      });

      cursorY -= 20;

      // Address Information Section
      cursorY = drawSection('Address Information', cursorY);
      
      const addressDetails = [
        ['Complete Address', applicationData.address],
        ['District', applicationData.district],
        ['State', applicationData.state],
        ['PIN Code', applicationData.pinCode],
      ];

      addressDetails.forEach(([label, value]) => {
        drawText(`${label}:`, margin + 20, cursorY, 11, true);
        // Handle long addresses with line wrapping
        const text = String(value || '');
        if (text.length > 50) {
          const lines = text.match(/.{1,50}/g) || [text];
          lines.forEach((line, index) => {
            drawText(line, margin + 200, cursorY - (index * 12), 11, false);
          });
          cursorY -= (lines.length - 1) * 12;
        } else {
          drawText(text, margin + 200, cursorY, 11, false);
        }
        cursorY -= 18;
      });

      cursorY -= 20;

      // Payment Information Section
      cursorY = drawSection('Payment Information', cursorY);
      
      const paymentDetails = [
        ['UTR / Transaction ID', applicationData.paymentTransactionId || 'Not provided'],
        ['Payment Status', 'Screenshot uploaded'],
      ];

      paymentDetails.forEach(([label, value]) => {
        drawText(`${label}:`, margin + 20, cursorY, 11, true);
        drawText(String(value || ''), margin + 200, cursorY, 11, false);
        cursorY -= 18;
      });

      cursorY -= 30;

      // Signature Section
      if (signatureFile && signatureFile.buffer) {
        try {
          let embeddedImage;
          if (signatureFile.mimetype === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(signatureFile.buffer);
          } else {
            embeddedImage = await pdfDoc.embedJpg(signatureFile.buffer);
          }
          
          // Signature section background
          page.drawRectangle({
            x: margin,
            y: cursorY - 110,
            width: contentWidth,
            height: 110,
            color: rgb(0.98, 0.98, 0.98),
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 1,
          });
          
          drawText('Applicant Signature', margin + 20, cursorY - 25, 12, true, rgb(0.2, 0.2, 0.2));
          
          const imgWidth = 180;
          const scale = imgWidth / embeddedImage.width;
          const imgHeight = embeddedImage.height * scale;
          
          // Place signature on the right side of the box, vertically centered
          const boxTopY = cursorY - 110;
          const boxInnerY = boxTopY + (110 - imgHeight) / 2;
          const imgX = margin + contentWidth - imgWidth - 20;
          const imgY = boxInnerY + 10;
          
          page.drawImage(embeddedImage, { 
            x: imgX, 
            y: imgY, 
            width: imgWidth, 
            height: imgHeight 
          });
          
          // Add a sign line on the left for clarity
          drawText('Signed by:', margin + 20, boxTopY + 30, 11, false, rgb(0.3, 0.3, 0.3));
          
          cursorY = boxTopY - 20;
        } catch (e) {
          console.warn('Failed to embed signature into PDF:', e.message);
        }
      }

      // Footer
      cursorY = Math.max(cursorY - 50, 50);
      drawLine(margin, cursorY, width - margin, cursorY, rgb(0.8, 0.8, 0.8));
      drawText('This is a computer-generated application form.', margin, cursorY - 15, 9, false, rgb(0.5, 0.5, 0.5));
      drawText('POGS - Patna Obstetrics & Gynaecological Society', width - margin - 200, cursorY - 15, 9, false, rgb(0.5, 0.5, 0.5));

      const pdfBytes = await pdfDoc.save();
      const pdfFileName = `membership-application-${uid}.pdf`;
      const pdfUpload = await googleDriveService.uploadFile(Buffer.from(pdfBytes), pdfFileName, 'application/pdf', 'application');
      application.applicationPdf = pdfUpload.id;
      console.log('Application PDF uploaded to Google Drive:', pdfUpload.id);
    } catch (pdfError) {
      console.error('Failed to generate/upload application PDF:', pdfError.message);
      // Proceed without PDF if generation fails
    }

    await application.save();
    
    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: application._id,
      applicationIdentifier: uid
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
