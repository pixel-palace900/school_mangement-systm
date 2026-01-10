const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadProfileImage } = require('../config/cloudinary');
const profileController = require('../controllers/profileController');

// Get user profile
router.get('/', protect, profileController.getUserProfile);

// Update user profile
router.put('/', protect, profileController.updateUserProfile);

// Upload profile image
router.post('/upload-image', protect, uploadProfileImage.single('profileImage'), profileController.uploadProfileImage);

// Delete profile image
router.delete('/delete-image', protect, profileController.deleteProfileImage);

module.exports = router;

