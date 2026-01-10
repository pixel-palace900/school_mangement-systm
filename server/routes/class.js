const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');
const { validateClass } = require('../middleware/validator');

// Get all classes
router.get(
  '/',
  protect,
  authorize('admin', 'teacher', 'parent', 'student'),
  classController.getAllClasses
);

// Get class by ID
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'parent', 'student'),
  classController.getClassById
);

// Create new class
router.post(
  '/',
  protect,
  authorize('admin'),
  validateClass,
  classController.createClass
);

// Update class
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateClass,
  classController.updateClass
);

// Delete class
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  classController.deleteClass
);

// Get students in a class
router.get(
  '/:id/students',
  protect,
  authorize('admin', 'teacher'),
  classController.getClassStudents
);

module.exports = router;
