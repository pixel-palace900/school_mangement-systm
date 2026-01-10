const express = require('express');
const router = express.Router();
const circularController = require('../controllers/circularController');
const { protect, authorize } = require('../middleware/auth');
const { validateCircular } = require('../middleware/validator');

// Get circulars by target audience
router.get(
  '/audience/:targetAudience',
  protect,
  circularController.getCircularsByAudience
);

// Get all circulars
router.get(
  '/',
  protect,
  authorize('admin', 'teacher'),
  circularController.getAllCirculars
);

// Get circular by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  circularController.getCircularById
);

// Create new circular
router.post(
  '/',
  protect,
  authorize('admin', 'teacher'),
  validateCircular,
  circularController.createCircular
);

// Update circular
router.put(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  validateCircular,
  circularController.updateCircular
);

// Delete circular
router.delete(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  circularController.deleteCircular
);

module.exports = router;
