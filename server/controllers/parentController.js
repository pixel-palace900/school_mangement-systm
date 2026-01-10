const Parent = require('../models/Parent');
const Student = require('../models/Student');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all parents
 * @route GET /api/parent
 * @access Private/Admin
 */
exports.getAllParents = async (req, res) => {
  try {
    // Support filtering by name or email
    const filter = {};
    
    // Filter by name if provided
    if (req.query.name) {
      filter.name = { $regex: new RegExp(req.query.name, 'i') }; // Case-insensitive search
    }
    
    // Filter by email if provided
    if (req.query.email) {
      filter.email = { $regex: new RegExp(req.query.email, 'i') }; // Case-insensitive search
    }
    
    // Get parents
    const parents = await Parent.find(filter).sort({ name: 1 });
    
    return success(res, { 
      parents, 
      count: parents.length 
    }, 'Parents retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve parents', 500, err.message);
  }
};

/**
 * Get parent by ID
 * @route GET /api/parent/:id
 * @access Private/Admin
 */
exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    
    if (!parent) {
      return error(res, 'Parent not found', 404);
    }
    
    return success(res, parent, 'Parent retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve parent', 500, err.message);
  }
};

/**
 * Create new parent
 * @route POST /api/parent
 * @access Private/Admin
 */
exports.createParent = async (req, res) => {
  try {
    // Check if parent with this email already exists
    const existingParent = await Parent.findOne({ email: req.body.email });
    if (existingParent) {
      return error(res, 'Parent with this email already exists', 400);
    }
    
    // Create new parent
    const parent = new Parent({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    });
    
    const savedParent = await parent.save();
    
    return success(res, savedParent, 'Parent created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create parent', 500, err.message);
  }
};

/**
 * Update parent
 * @route PUT /api/parent/:id
 * @access Private/Admin
 */
exports.updateParent = async (req, res) => {
  try {
    // Check if parent exists
    let parent = await Parent.findById(req.params.id);
    
    if (!parent) {
      return error(res, 'Parent not found', 404);
    }
    
    // If email is being updated, check if it's already in use
    if (req.body.email && req.body.email !== parent.email) {
      const existingParent = await Parent.findOne({ email: req.body.email });
      if (existingParent) {
        return error(res, 'Email is already in use', 400);
      }
    }
    
    // Update parent
    parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    return success(res, parent, 'Parent updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update parent', 500, err.message);
  }
};

/**
 * Delete parent
 * @route DELETE /api/parent/:id
 * @access Private/Admin
 */
exports.deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    
    if (!parent) {
      return error(res, 'Parent not found', 404);
    }
    
    // Check if there are students associated with this parent
    const studentsWithParent = await Student.countDocuments({ parentId: req.params.id });
    
    if (studentsWithParent > 0) {
      return error(res, `Cannot delete parent with ${studentsWithParent} associated students. Please reassign students first.`, 400);
    }
    
    await Parent.findByIdAndDelete(req.params.id);
    
    return success(res, null, 'Parent deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete parent', 500, err.message);
  }
};

/**
 * Get children of a parent
 * @route GET /api/parent/:id/children
 * @access Private/Admin/Parent
 */
exports.getParentChildren = async (req, res) => {
  try {
    // Check if parent exists
    const parent = await Parent.findById(req.params.id);
    
    if (!parent) {
      return error(res, 'Parent not found', 404);
    }
    
    // Get students associated with this parent
    const children = await Student.find({ parentId: req.params.id })
      .select('-password')
      .populate('classId', 'name section');
    
    return success(res, { 
      children, 
      count: children.length 
    }, 'Parent children retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve parent children', 500, err.message);
  }
};

/**
 * Get parent profile (for parent users)
 * @route GET /api/parent/profile
 * @access Private/Parent
 */
exports.getParentProfile = async (req, res) => {
  try {
    // In a real application, this would use the authenticated user's ID
    // For now, we'll use the mock user from the auth middleware
    const parent = await Parent.findById(req.user.id);
    
    if (!parent) {
      return error(res, 'Parent profile not found', 404);
    }
    
    // Get children information
    const children = await Student.find({ parentId: req.user.id })
      .select('-password')
      .populate('classId', 'name section');
    
    return success(res, { 
      parent,
      children,
      childrenCount: children.length
    }, 'Parent profile retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve parent profile', 500, err.message);
  }
};
