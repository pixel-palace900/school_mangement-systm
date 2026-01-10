const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateAdmin } = require('../middleware/validator');
const { uploadProfileImage } = require('../config/cloudinary');

// Admin profile routes (must come before /:id routes to avoid conflicts)
router.get('/profile', protect, authorize('admin'), adminController.getAdminProfile);
router.put('/profile', protect, authorize('admin'), adminController.updateAdminProfile);
router.post('/profile/upload-image', protect, authorize('admin'), uploadProfileImage.single('profileImage'), adminController.uploadAdminProfileImage);

// Admin utility routes (must come before /:id routes to avoid conflicts)
router.get('/search', protect, authorize('admin'), adminController.searchAdmins);
router.get('/stats', protect, authorize('admin'), adminController.getAdminStats);

// Admin routes
// All routes are protected and only accessible by admins
router.get('/', protect, authorize('admin'), adminController.getAllAdmins);
router.get('/:id', protect, authorize('admin'), adminController.getAdminById);
router.post('/', protect, authorize('admin'), validateAdmin, adminController.createAdmin);
router.put('/:id', protect, authorize('admin'), validateAdmin, adminController.updateAdmin);
router.delete('/:id', protect, authorize('admin'), adminController.deleteAdmin);

module.exports = router;

