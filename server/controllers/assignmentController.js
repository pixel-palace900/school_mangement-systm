const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Class = require('../models/Class');
const Student = require('../models/Student');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all assignments
 * @route GET /api/assignment
 * @access Private/Admin/Teacher
 */
exports.getAllAssignments = async (req, res) => {
  try {
    // Support filtering by class, subject, or teacher
    const filter = {};
    
    // Filter by class ID if provided
    if (req.query.classId) {
      filter.classId = req.query.classId;
    }
    
    // Filter by subject if provided
    if (req.query.subject) {
      filter.subject = { $regex: new RegExp(req.query.subject, 'i') }; // Case-insensitive search
    }
    
    // Filter by teacher ID if provided
    if (req.query.assignedBy) {
      filter.assignedBy = req.query.assignedBy;
    }
    
    // Filter by due date range if provided
    if (req.query.startDate && req.query.endDate) {
      filter.dueDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.dueDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.dueDate = { $lte: new Date(req.query.endDate) };
    }
    
    // Get assignments with class and teacher details
    const assignments = await Assignment.find(filter)
      .populate('classId', 'name section')
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1 });
    
    return success(res, { 
      assignments, 
      count: assignments.length 
    }, 'Assignments retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve assignments', 500, err.message);
  }
};

/**
 * Get assignment by ID
 * @route GET /api/assignment/:id
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('classId', 'name section')
      .populate('assignedBy', 'name email');
    
    if (!assignment) {
      return error(res, 'Assignment not found', 404);
    }
    
    // If student or parent, check if they have access to this assignment
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id);
      if (!student || student.classId.toString() !== assignment.classId._id.toString()) {
        return error(res, 'Unauthorized access to assignment', 403);
      }
    }
    
    if (req.user.role === 'parent') {
      // Check if any of the parent's children are in this class
      const children = await Student.find({ parentId: req.user.id });
      const hasAccess = children.some(child => 
        child.classId.toString() === assignment.classId._id.toString()
      );
      
      if (!hasAccess) {
        return error(res, 'Unauthorized access to assignment', 403);
      }
    }
    
    return success(res, assignment, 'Assignment retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve assignment', 500, err.message);
  }
};

/**
 * Create new assignment
 * @route POST /api/assignment
 * @access Private/Admin/Teacher
 */
exports.createAssignment = async (req, res) => {
  try {
    // Validate class exists
    const classExists = await Class.findById(req.body.classId);
    if (!classExists) {
      return error(res, 'Class not found', 404);
    }
    
    // Create new assignment
    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      classId: req.body.classId,
      subject: req.body.subject,
      assignedBy: req.user.id,
      dueDate: req.body.dueDate,
      maxMarks: req.body.maxMarks || 10,
      attachments: req.body.attachments || []
    });
    
    const savedAssignment = await assignment.save();
    
    // Return with populated data
    const populatedAssignment = await Assignment.findById(savedAssignment._id)
      .populate('classId', 'name section')
      .populate('assignedBy', 'name email');
    
    return success(res, populatedAssignment, 'Assignment created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create assignment', 500, err.message);
  }
};

/**
 * Update assignment
 * @route PUT /api/assignment/:id
 * @access Private/Admin/Teacher
 */
exports.updateAssignment = async (req, res) => {
  try {
    // Check if assignment exists
    let assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return error(res, 'Assignment not found', 404);
    }
    
    // If teacher, check if they are the one who created it
    if (req.user.role === 'teacher' && assignment.assignedBy.toString() !== req.user.id) {
      return error(res, 'You can only update assignments that you have created', 403);
    }
    
    // If classId is being updated, validate class exists
    if (req.body.classId && req.body.classId !== assignment.classId.toString()) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }
    
    // Update assignment
    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: Date.now()
        } 
      },
      { new: true, runValidators: true }
    )
      .populate('classId', 'name section')
      .populate('assignedBy', 'name email');
    
    return success(res, assignment, 'Assignment updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update assignment', 500, err.message);
  }
};

/**
 * Delete assignment
 * @route DELETE /api/assignment/:id
 * @access Private/Admin/Teacher
 */
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return error(res, 'Assignment not found', 404);
    }
    
    // If teacher, check if they are the one who created it
    if (req.user.role === 'teacher' && assignment.assignedBy.toString() !== req.user.id) {
      return error(res, 'You can only delete assignments that you have created', 403);
    }
    
    // Check if there are submissions for this assignment
    const submissionsCount = await AssignmentSubmission.countDocuments({ assignmentId: req.params.id });
    
    if (submissionsCount > 0) {
      return error(res, `Cannot delete assignment with ${submissionsCount} submissions. Please delete the submissions first.`, 400);
    }
    
    await assignment.remove();
    
    return success(res, null, 'Assignment deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete assignment', 500, err.message);
  }
};

/**
 * Get assignments by class
 * @route GET /api/assignment/class/:classId
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getAssignmentsByClass = async (req, res) => {
  try {
    // Check if class exists
    const classExists = await Class.findById(req.params.classId);
    
    if (!classExists) {
      return error(res, 'Class not found', 404);
    }
    
    // If student or parent, check if they have access to this class
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id);
      if (!student || student.classId.toString() !== req.params.classId) {
        return error(res, 'Unauthorized access to class assignments', 403);
      }
    }
    
    if (req.user.role === 'parent') {
      // Check if any of the parent's children are in this class
      const children = await Student.find({ parentId: req.user.id });
      const hasAccess = children.some(child => 
        child.classId.toString() === req.params.classId
      );
      
      if (!hasAccess) {
        return error(res, 'Unauthorized access to class assignments', 403);
      }
    }
    
    // Get assignments for this class
    const assignments = await Assignment.find({ classId: req.params.classId })
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1 });
    
    return success(res, { 
      assignments, 
      count: assignments.length 
    }, 'Class assignments retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class assignments', 500, err.message);
  }
};
