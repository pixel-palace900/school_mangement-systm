const Circular = require('../models/Circular');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all circulars
 * @route GET /api/circular
 * @access Private/Admin, Teacher
 */
exports.getAllCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ issueDate: -1 });
    return success(res, { circulars, count: circulars.length }, 'Circulars retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve circulars', 500, err.message);
  }
};

/**
 * Get circular by ID
 * @route GET /api/circular/:id
 * @access Private/Admin, Teacher, Student, Parent
 */
exports.getCircularById = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);
    
    if (!circular) {
      return error(res, 'Circular not found', 404);
    }
    
    return success(res, circular, 'Circular retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve circular', 500, err.message);
  }
};

/**
 * Create new circular
 * @route POST /api/circular
 * @access Private/Admin, Teacher
 */
exports.createCircular = async (req, res) => {
  try {
    const { title, content, targetAudience } = req.body;
    
    // Create new circular
    const circular = new Circular({
      title,
      content,
      targetAudience,
      issuedBy: req.user.id,
      issuedByModel: req.user.role === 'admin' ? 'Admin' : 'Teacher'
    });
    
    const savedCircular = await circular.save();
    
    return success(res, savedCircular, 'Circular created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create circular', 500, err.message);
  }
};

/**
 * Update circular
 * @route PUT /api/circular/:id
 * @access Private/Admin, Teacher (owner)
 */
exports.updateCircular = async (req, res) => {
  try {
    const { title, content, targetAudience } = req.body;
    
    // Find circular
    let circular = await Circular.findById(req.params.id);
    
    if (!circular) {
      return error(res, 'Circular not found', 404);
    }
    
    // Check if user is authorized to update this circular
    // Admin can update any circular, teacher can only update their own
    if (req.user.role === 'teacher' && 
        circular.issuedBy.toString() !== req.user.id.toString()) {
      return error(res, 'Not authorized to update this circular', 403);
    }
    
    // Update circular
    circular.title = title || circular.title;
    circular.content = content || circular.content;
    circular.targetAudience = targetAudience || circular.targetAudience;
    
    const updatedCircular = await circular.save();
    
    return success(res, updatedCircular, 'Circular updated successfully');
  } catch (err) {
    return error(res, 'Failed to update circular', 500, err.message);
  }
};

/**
 * Delete circular
 * @route DELETE /api/circular/:id
 * @access Private/Admin, Teacher (owner)
 */
exports.deleteCircular = async (req, res) => {
  try {
    // Find circular
    const circular = await Circular.findById(req.params.id);
    
    if (!circular) {
      return error(res, 'Circular not found', 404);
    }
    
    // Check if user is authorized to delete this circular
    // Admin can delete any circular, teacher can only delete their own
    if (req.user.role === 'teacher' && 
        circular.issuedBy.toString() !== req.user.id.toString()) {
      return error(res, 'Not authorized to delete this circular', 403);
    }
    
    await circular.deleteOne();
    
    return success(res, {}, 'Circular deleted successfully');
  } catch (err) {
    return error(res, 'Failed to delete circular', 500, err.message);
  }
};

/**
 * Get circulars by target audience
 * @route GET /api/circular/audience/:targetAudience
 * @access Private/Admin, Teacher, Student, Parent (based on audience)
 */
exports.getCircularsByAudience = async (req, res) => {
  try {
    const { targetAudience } = req.params;
    
    // Validate target audience
    if (!['all', 'teachers', 'parents'].includes(targetAudience)) {
      return error(res, 'Invalid target audience', 400);
    }
    
    // Get circulars for the specified audience
    const circulars = await Circular.find({ 
      $or: [
        { targetAudience: targetAudience },
        { targetAudience: 'all' }
      ]
    }).sort({ issueDate: -1 });
    
    return success(res, { circulars, count: circulars.length }, 'Circulars retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve circulars', 500, err.message);
  }
};
