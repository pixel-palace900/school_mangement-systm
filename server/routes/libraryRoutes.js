const express = require('express');
const router = express.Router();
const { 
  getAllResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource
} = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/auth');

// Base route: /api/library

// Get all library resources - All authenticated users
router.get('/', protect, authorize('admin', 'teacher', 'student', 'parent'), getAllResources);

// Create new library resource - Admin and Teacher only
router.post('/', protect, authorize('admin', 'teacher'), createResource);

// Get, update, delete library resource by ID
router.get('/:id', protect, authorize('admin', 'teacher', 'student', 'parent'), getResourceById);
router.put('/:id', protect, authorize('admin', 'teacher'), updateResource);
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteResource);

module.exports = router;
