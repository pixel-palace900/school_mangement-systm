const express = require('express');
const router = express.Router();
const { 
  getAllAssignments, 
  getAssignmentById, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment,
  getAssignmentsByClass
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

// Base route: /api/assignment

// Get all assignments - Admin and Teacher only
router.get('/', protect, authorize('admin', 'teacher'), getAllAssignments);

// Create new assignment - Admin and Teacher only
router.post('/', protect, authorize('admin', 'teacher'), createAssignment);

// Get assignments by class - All authenticated users
router.get('/class/:classId', protect, authorize('admin', 'teacher', 'student', 'parent'), getAssignmentsByClass);

// Get, update, delete assignment by ID
router.get('/:id', protect, authorize('admin', 'teacher', 'student', 'parent'), getAssignmentById);
router.put('/:id', protect, authorize('admin', 'teacher'), updateAssignment);
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteAssignment);

module.exports = router;
