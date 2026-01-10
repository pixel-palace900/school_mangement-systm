const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');
const { validateSubject } = require('../middleware/validator');

// Get subjects by class
router.get(
  '/class/:classId',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  subjectController.getSubjectsByClass
);

// Get subjects by teacher
router.get(
  '/teacher/:teacherId',
  protect,
  authorize('admin', 'teacher'),
  subjectController.getSubjectsByTeacher
);

// Get all subjects
router.get(
  '/',
  protect,
  authorize('admin', 'teacher'),
  subjectController.getAllSubjects
);

// Get subject by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'student', 'parent'),
  subjectController.getSubjectById
);

// Create new subject
router.post(
  '/',
  protect,
  authorize('admin'),
  validateSubject,
  subjectController.createSubject
);

// Update subject
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateSubject,
  subjectController.updateSubject
);

// Delete subject
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  subjectController.deleteSubject
);

module.exports = router;
