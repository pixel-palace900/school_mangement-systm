const express = require('express');
const router = express.Router();
const { uploadDocument } = require('../config/cloudinary');
const { success, error } = require('../utils/responseHandler');

// Simple test upload endpoint (no authentication required for testing)
router.post('/test-upload', 
  uploadDocument.single('testFile'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return error(res, 'No file uploaded', 400);
      }

      const fileData = {
        originalName: req.file.originalname,
        url: req.file.path,
        publicId: req.file.filename,
        size: req.file.size,
        format: req.file.format,
        resourceType: req.file.resource_type
      };

      return success(res, fileData, 'Test file uploaded successfully to Cloudinary');
    } catch (err) {
      console.error('Test upload error:', err);
      return error(res, 'Failed to upload test file', 500, err.message);
    }
  }
);

// Test Cloudinary connection
router.get('/test-connection', async (req, res) => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    
    // Test API connection by getting account details
    const result = await cloudinary.api.ping();
    
    return success(res, {
      status: result.status,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      connected: true
    }, 'Cloudinary connection successful');
  } catch (err) {
    console.error('Cloudinary connection test failed:', err);
    return error(res, 'Cloudinary connection failed', 500, err.message);
  }
});

module.exports = router;
