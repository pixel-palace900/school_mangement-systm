const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const { validateAttendance } = require('../middleware/validator');

// Get attendance statistics
router.get(
  '/stats',
  protect,
  authorize('admin', 'teacher'),
  attendanceController.getAttendanceStats
);

// Get all attendance records
router.get(
  '/',
  protect,
  authorize('admin', 'teacher', 'parent'),
  attendanceController.getAllAttendance
);

// Get attendance record by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'parent'),
  attendanceController.getAttendanceById
);

// Create new attendance record
router.post(
  '/',
  protect,
  authorize('admin', 'teacher'),
  validateAttendance,
  attendanceController.createAttendance
);

// Update attendance record
router.put(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  validateAttendance,
  attendanceController.updateAttendance
);

// Delete attendance record
router.delete(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  attendanceController.deleteAttendance
);

module.exports = router;
