const LibraryResource = require('../models/LibraryResource');
const LibraryBorrowing = require('../models/LibraryBorrowing');
const Class = require('../models/Class');
const Student = require('../models/Student');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all library resources
 * @route GET /api/library
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getAllResources = async (req, res) => {
  try {
    // Support filtering by type, subject, or class
    const filter = {};
    
    // Filter by resource type if provided
    if (req.query.resourceType) {
      filter.resourceType = req.query.resourceType;
    }
    
    // Filter by subject if provided
    if (req.query.subject) {
      filter.subject = { $regex: new RegExp(req.query.subject, 'i') }; // Case-insensitive search
    }
    
    // Filter by class if provided
    if (req.query.classId) {
      filter.forClasses = req.query.classId;
    }
    
    // Filter by search term if provided
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    // Filter by access level based on user role
    if (req.user.role !== 'admin') {
      filter.accessibleTo = req.user.role;
    }
    
    // Get resources with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const resources = await LibraryResource.find(filter)
      .populate('forClasses', 'name section')
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await LibraryResource.countDocuments(filter);
    
    return success(res, { 
      resources, 
      count: resources.length,
      total,
      page,
      pages: Math.ceil(total / limit)
    }, 'Library resources retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve library resources', 500, err.message);
  }
};

/**
 * Get resource by ID
 * @route GET /api/library/:id
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getResourceById = async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id)
      .populate('forClasses', 'name section')
      .populate('addedBy', 'name email');
    
    if (!resource) {
      return error(res, 'Resource not found', 404);
    }
    
    // Check if user has access to this resource
    if (req.user.role !== 'admin' && !resource.accessibleTo.includes(req.user.role)) {
      return error(res, 'Unauthorized access to resource', 403);
    }
    
    // If resource is class-specific, check if user has access to those classes
    if (resource.forClasses && resource.forClasses.length > 0) {
      if (req.user.role === 'student') {
        const student = await Student.findById(req.user.id);
        const hasAccess = resource.forClasses.some(cls => 
          cls._id.toString() === student.classId.toString()
        );
        
        if (!hasAccess) {
          return error(res, 'This resource is not available for your class', 403);
        }
      }
      
      if (req.user.role === 'parent') {
        // Check if any of the parent's children are in these classes
        const children = await Student.find({ parentId: req.user.id });
        const hasAccess = children.some(child => 
          resource.forClasses.some(cls => 
            cls._id.toString() === child.classId.toString()
          )
        );
        
        if (!hasAccess) {
          return error(res, 'This resource is not available for your children\'s classes', 403);
        }
      }
    }
    
    return success(res, resource, 'Resource retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve resource', 500, err.message);
  }
};

/**
 * Create new library resource
 * @route POST /api/library
 * @access Private/Admin/Teacher
 */
exports.createResource = async (req, res) => {
  try {
    // Validate classes if provided
    if (req.body.forClasses && req.body.forClasses.length > 0) {
      for (const classId of req.body.forClasses) {
        const classExists = await Class.findById(classId);
        if (!classExists) {
          return error(res, `Class with ID ${classId} not found`, 404);
        }
      }
    }
    
    // Create new resource
    const resource = new LibraryResource({
      title: req.body.title,
      description: req.body.description,
      resourceType: req.body.resourceType,
      subject: req.body.subject,
      author: req.body.author,
      publisher: req.body.publisher,
      publicationYear: req.body.publicationYear,
      isbn: req.body.isbn,
      totalCopies: req.body.totalCopies || 1,
      availableCopies: req.body.availableCopies || req.body.totalCopies || 1,
      fileUrl: req.body.fileUrl,
      fileType: req.body.fileType,
      fileSize: req.body.fileSize,
      accessibleTo: req.body.accessibleTo || ['admin', 'teacher', 'student', 'parent'],
      forClasses: req.body.forClasses || [],
      addedBy: req.user.id,
      addedByModel: req.user.role === 'admin' ? 'Admin' : 'Teacher'
    });
    
    const savedResource = await resource.save();
    
    // Return with populated data
    const populatedResource = await LibraryResource.findById(savedResource._id)
      .populate('forClasses', 'name section')
      .populate('addedBy', 'name email');
    
    return success(res, populatedResource, 'Library resource created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create library resource', 500, err.message);
  }
};

/**
 * Update library resource
 * @route PUT /api/library/:id
 * @access Private/Admin/Teacher
 */
exports.updateResource = async (req, res) => {
  try {
    // Check if resource exists
    let resource = await LibraryResource.findById(req.params.id);
    
    if (!resource) {
      return error(res, 'Resource not found', 404);
    }
    
    // If teacher, check if they are the one who added it
    if (req.user.role === 'teacher' && 
        (resource.addedByModel !== 'Teacher' || 
         resource.addedBy.toString() !== req.user.id)) {
      return error(res, 'You can only update resources that you have added', 403);
    }
    
    // Validate classes if provided
    if (req.body.forClasses && req.body.forClasses.length > 0) {
      for (const classId of req.body.forClasses) {
        const classExists = await Class.findById(classId);
        if (!classExists) {
          return error(res, `Class with ID ${classId} not found`, 404);
        }
      }
    }
    
    // Update resource
    resource = await LibraryResource.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: Date.now()
        } 
      },
      { new: true, runValidators: true }
    )
      .populate('forClasses', 'name section')
      .populate('addedBy', 'name email');
    
    return success(res, resource, 'Library resource updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update library resource', 500, err.message);
  }
};

/**
 * Delete library resource
 * @route DELETE /api/library/:id
 * @access Private/Admin/Teacher
 */
exports.deleteResource = async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id);
    
    if (!resource) {
      return error(res, 'Resource not found', 404);
    }
    
    // If teacher, check if they are the one who added it
    if (req.user.role === 'teacher' && 
        (resource.addedByModel !== 'Teacher' || 
         resource.addedBy.toString() !== req.user.id)) {
      return error(res, 'You can only delete resources that you have added', 403);
    }
    
    // Check if there are active borrowings for this resource
    const activeBorrowings = await LibraryBorrowing.countDocuments({ 
      resourceId: req.params.id,
      status: { $in: ['borrowed', 'overdue'] }
    });
    
    if (activeBorrowings > 0) {
      return error(res, `Cannot delete resource with ${activeBorrowings} active borrowings. Please return all copies first.`, 400);
    }
    
    await resource.remove();
    
    return success(res, null, 'Library resource deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete library resource', 500, err.message);
  }
};
