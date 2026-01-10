const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  cloudinary,
  uploadProfileImage,
  uploadAssignment,
  uploadLibraryResource,
  uploadCircular,
  uploadDocument,
  deleteFromCloudinary
} = require('../config/cloudinary');
const { success, error } = require('../utils/responseHandler');

// Upload profile image
router.post('/profile-image',
  protect,
  uploadProfileImage.single('profileImage'),
  async (req, res) => {
    try {
      if (!req.file) {
        return error(res, 'No file uploaded', 400);
      }

      const fileData = {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        format: req.file.format
      };

      return success(res, fileData, 'Profile image uploaded successfully');
    } catch (err) {
  console.error('❌ Profile image upload error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    cause: err.cause,
  });

  return error(res, 'Failed to upload profile image', 500, err.message || 'Unknown error');
}

  }
);

// Upload assignment attachment
router.post('/assignment/:assignmentId?',
  protect,
  authorize('teacher', 'student'),
  uploadAssignment.array('attachments', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return error(res, 'No files uploaded', 400);
      }

      const filesData = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        size: file.size,
        format: file.format,
        resourceType: file.resource_type
      }));

      return success(res, filesData, 'Assignment files uploaded successfully');
    } catch (err) {
      return error(res, 'Failed to upload assignment files', 500, err.message);
    }
  }
);

// Upload library resource
router.post('/library-resource',
  protect,
  authorize('admin', 'teacher'),
  uploadLibraryResource.single('resource'),
  async (req, res) => {
    try {
      if (!req.file) {
        return error(res, 'No file uploaded', 400);
      }

      const fileData = {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        format: req.file.format,
        resourceType: req.file.resource_type
      };

      return success(res, fileData, 'Library resource uploaded successfully');
    } catch (err) {
      return error(res, 'Failed to upload library resource', 500, err.message);
    }
  }
);

// Upload circular attachment
router.post('/circular',
  protect,
  authorize('admin', 'teacher'),
  uploadCircular.array('attachments', 3),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return error(res, 'No files uploaded', 400);
      }

      const filesData = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        size: file.size,
        format: file.format,
        resourceType: file.resource_type
      }));

      return success(res, filesData, 'Circular files uploaded successfully');
    } catch (err) {
      return error(res, 'Failed to upload circular files', 500, err.message);
    }
  }
);

// Upload general document
router.post('/document',
  protect,
  uploadDocument.single('document'),
  async (req, res) => {
    try {
      if (!req.file) {
        return error(res, 'No file uploaded', 400);
      }

      const fileData = {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        format: req.file.format,
        resourceType: req.file.resource_type
      };

      return success(res, fileData, 'Document uploaded successfully');
    } catch (err) {
      return error(res, 'Failed to upload document', 500, err.message);
    }
  }
);

// Delete file from Cloudinary
router.delete('/file/:publicId',
  protect,
  async (req, res) => {
    try {
      const { publicId } = req.params;
      const { resourceType = 'image' } = req.query;

      if (!publicId) {
        return error(res, 'Public ID is required', 400);
      }

      const result = await deleteFromCloudinary(publicId, resourceType);

      if (result.result === 'ok') {
        return success(res, { publicId, deleted: true }, 'File deleted successfully');
      } else {
        return error(res, 'Failed to delete file', 400);
      }
    } catch (err) {
      return error(res, 'Failed to delete file', 500, err.message);
    }
  }
);

// Get upload signature for direct uploads (optional)
router.post('/signature',
  protect,
  async (req, res) => {
    try {
      const { folder, resourceType = 'auto' } = req.body;

      const timestamp = Math.round(new Date().getTime() / 1000);
      const params = {
        timestamp,
        folder: folder || 'school-management/general',
        resource_type: resourceType
      };

      const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

      return success(res, {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder: params.folder
      }, 'Upload signature generated successfully');
    } catch (err) {
      return error(res, 'Failed to generate upload signature', 500, err.message);
    }
  }
);

module.exports = router;

