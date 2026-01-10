const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all classes
 * @route GET /api/class
 * @access Private/Admin/Teacher
 */
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'name email subjectSpecialization');
    
    return success(res, { 
      classes, 
      count: classes.length 
    }, 'Classes retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve classes', 500, err.message);
  }
};

/**
 * Get class by ID
 * @route GET /api/class/:id
 * @access Private/Admin/Teacher
 */
exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('classTeacher', 'name email subjectSpecialization');
    
    if (!classItem) {
      return error(res, 'Class not found', 404);
    }
    
    return success(res, classItem, 'Class retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class', 500, err.message);
  }
};

/**
 * Create new class
 * @route POST /api/class
 * @access Private/Admin
 */
exports.createClass = async (req, res) => {
  try {
    // If classTeacher is provided, validate teacher exists
    if (req.body.classTeacher) {
      const teacher = await Teacher.findById(req.body.classTeacher);
      if (!teacher) {
        return error(res, 'Teacher not found', 404);
      }
    }
    
    // Create new class
    const classItem = new Class({
      name: req.body.name,
      section: req.body.section,
      classTeacher: req.body.classTeacher
    });
    
    const savedClass = await classItem.save();
    
    // If teacher is assigned, update teacher's classAssigned field
    if (req.body.classTeacher) {
      await Teacher.findByIdAndUpdate(
        req.body.classTeacher,
        { classAssigned: savedClass._id }
      );
    }
    
    // Return with populated teacher data
    const populatedClass = await Class.findById(savedClass._id)
      .populate('classTeacher', 'name email subjectSpecialization');
    
    return success(res, populatedClass, 'Class created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create class', 500, err.message);
  }
};

/**
 * Update class
 * @route PUT /api/class/:id
 * @access Private/Admin
 */
exports.updateClass = async (req, res) => {
  try {
    // Check if class exists
    let classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return error(res, 'Class not found', 404);
    }
    
    // If classTeacher is being updated, validate teacher exists
    if (req.body.classTeacher && req.body.classTeacher !== classItem.classTeacher?.toString()) {
      const teacher = await Teacher.findById(req.body.classTeacher);
      if (!teacher) {
        return error(res, 'Teacher not found', 404);
      }
      
      // Update previous teacher's classAssigned field if there was one
      if (classItem.classTeacher) {
        await Teacher.findByIdAndUpdate(
          classItem.classTeacher,
          { $unset: { classAssigned: 1 } }
        );
      }
      
      // Update new teacher's classAssigned field
      await Teacher.findByIdAndUpdate(
        req.body.classTeacher,
        { classAssigned: classItem._id }
      );
    }
    
    // Update class
    classItem = await Class.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('classTeacher', 'name email subjectSpecialization');
    
    return success(res, classItem, 'Class updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update class', 500, err.message);
  }
};

/**
 * Delete class
 * @route DELETE /api/class/:id
 * @access Private/Admin
 */
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return error(res, 'Class not found', 404);
    }
    
    // Check if there are students in this class
    const studentsInClass = await Student.countDocuments({ classId: req.params.id });
    
    if (studentsInClass > 0) {
      return error(res, `Cannot delete class with ${studentsInClass} students. Please reassign students first.`, 400);
    }
    
    // If there's a teacher assigned to this class, update teacher's classAssigned field
    if (classItem.classTeacher) {
      await Teacher.findByIdAndUpdate(
        classItem.classTeacher,
        { $unset: { classAssigned: 1 } }
      );
    }
    
    await Class.findByIdAndDelete(req.params.id);
    
    return success(res, null, 'Class deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete class', 500, err.message);
  }
};

/**
 * Get students in a class
 * @route GET /api/class/:id/students
 * @access Private/Admin/Teacher
 */
exports.getClassStudents = async (req, res) => {
  try {
    // Check if class exists
    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return error(res, 'Class not found', 404);
    }
    
    // Get students in this class
    const students = await Student.find({ classId: req.params.id })
      .select('-password')
      .populate('parentId', 'name email phone');
    
    return success(res, { 
      students, 
      count: students.length 
    }, 'Class students retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class students', 500, err.message);
  }
};
