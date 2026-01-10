const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');
const { validateTeacher } = require('../middleware/validator');

// Get teacher profile (for teacher users)
router.get(
  '/profile',
  protect,
  authorize('teacher'),
  teacherController.getTeacherProfile
);

// Get teachers by subject
router.get(
  '/subject/:subjectId',
  protect,
  authorize('admin', 'teacher'),
  teacherController.getTeachersBySubject
);

// Get teachers by class
router.get(
  '/class/:classId',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  teacherController.getTeachersByClass
);

// Get all teachers
router.get(
  '/',
  protect,
  authorize('admin'),
  teacherController.getAllTeachers
);

// Get teacher by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  teacherController.getTeacherById
);

// Create new teacher
router.post(
  '/',
  protect,
  authorize('admin'),
  validateTeacher,
  teacherController.createTeacher
);

// Update teacher
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateTeacher,
  teacherController.updateTeacher
);

// Delete teacher
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  teacherController.deleteTeacher
);

module.exports = router;
