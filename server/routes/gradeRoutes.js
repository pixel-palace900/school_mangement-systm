const express = require('express');
const router = express.Router();
const { 
  getAllGrades, 
  getGradeById, 
  createGrade, 
  updateGrade, 
  deleteGrade,
  getGradesByStudent,
  getGradesByExam
} = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');

// Base route: /api/grade

// Get all grades - Admin and Teacher only
router.get('/', protect, authorize('admin', 'teacher'), getAllGrades);

// Create new grade - Admin and Teacher only
router.post('/', protect, authorize('admin', 'teacher'), createGrade);

// Get grades by student - All authenticated users
router.get('/student/:studentId', protect, authorize('admin', 'teacher', 'student', 'parent'), getGradesByStudent);

// Get grades by exam - Admin and Teacher only
router.get('/exam/:examId', protect, authorize('admin', 'teacher'), getGradesByExam);

// Get, update, delete grade by ID
router.get('/:id', protect, authorize('admin', 'teacher', 'student', 'parent'), getGradeById);
router.put('/:id', protect, authorize('admin', 'teacher'), updateGrade);
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteGrade);

module.exports = router;
