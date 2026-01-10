const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');
const { validateExam } = require('../middleware/validator');

// Get upcoming exams
router.get(
  '/upcoming',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  examController.getUpcomingExams
);

// Get exams by class
router.get(
  '/class/:classId',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  examController.getExamsByClass
);

// Get all exams
router.get(
  '/',
  protect,
  authorize('admin', 'teacher'),
  examController.getAllExams
);

// Get exam by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  examController.getExamById
);

// Create new exam
router.post(
  '/',
  protect,
  authorize('admin', 'teacher'),
  validateExam,
  examController.createExam
);

// Update exam
router.put(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  validateExam,
  examController.updateExam
);

// Delete exam
router.delete(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  examController.deleteExam
);

module.exports = router;
