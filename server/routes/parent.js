const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');
const { validateParent } = require('../middleware/validator');

// Get parent profile (for parent users)
router.get(
  '/profile',
  protect,
  authorize('parent'),
  parentController.getParentProfile
);

// Get children of a parent
router.get(
  '/:id/children',
  protect,
  authorize('admin', 'parent'),
  parentController.getParentChildren
);

// Get all parents
router.get(
  '/',
  protect,
  authorize('admin'),
  parentController.getAllParents
);

// Get parent by ID
router.get(
  '/:id',
  protect,
  authorize('admin'),
  parentController.getParentById
);

// Create new parent
router.post(
  '/',
  protect,
  authorize('admin'),
  validateParent,
  parentController.createParent
);

// Update parent
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateParent,
  parentController.updateParent
);

// Delete parent
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  parentController.deleteParent
);

module.exports = router;
