const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');
const { validateFee } = require('../middleware/validator');

// Get pending fees
router.get(
  '/pending',
  protect,
  authorize('admin'),
  feeController.getPendingFees
);

// Get fees by student
router.get(
  '/student/:studentId',
  protect,
  authorize('admin', 'parent'),
  feeController.getFeesByStudent
);

// Get all fees
router.get(
  '/',
  protect,
  authorize('admin'),
  feeController.getAllFees
);

// Get fee by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'parent'),
  feeController.getFeeById
);

// Create new fee
router.post(
  '/',
  protect,
  authorize('admin'),
  validateFee,
  feeController.createFee
);

// Update fee
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateFee,
  feeController.updateFee
);

// Delete fee
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  feeController.deleteFee
);

module.exports = router;
