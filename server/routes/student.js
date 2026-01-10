const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { validateStudent } = require('../middleware/validator');

// Get student profile (for student users)
router.get(
  '/profile',
  protect,
  authorize('student'),
  studentController.getStudentProfile
);

// Get student attendance
router.get(
  '/:id/attendance',
  protect,
  authorize('admin', 'teacher', 'parent', 'student'),
  studentController.getStudentAttendance
);

// Get student fees
router.get(
  '/:id/fees',
  protect,
  authorize('admin', 'parent', 'student'),
  studentController.getStudentFees
);

// Get student assignments
router.get(
  '/assignments',
  protect,
  authorize('student'),
  studentController.getStudentAssignments
);

// Get all students
router.get(
  '/',
  protect,
  authorize('admin', 'teacher'),
  studentController.getAllStudents
);

// Get student by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'parent'),
  studentController.getStudentById
);

// Create new student
router.post(
  '/',
  protect,
  authorize('admin'),
  validateStudent,
  studentController.createStudent
);

// Update student
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateStudent,
  studentController.updateStudent
);

// Delete student
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  studentController.deleteStudent
);

module.exports = router;
