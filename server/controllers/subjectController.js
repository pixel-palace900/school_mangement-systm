const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all subjects
 * @route GET /api/subject
 * @access Private/Admin/Teacher
 */
exports.getAllSubjects = async (req, res) => {
  try {
    // Support filtering by name, code, or category
    const filter = {};
    
    // Filter by name if provided (case-insensitive partial match)
    if (req.query.name) {
      filter.name = { $regex: new RegExp(req.query.name, 'i') };
    }
    
    // Filter by code if provided (exact match)
    if (req.query.code) {
      filter.code = req.query.code;
    }
    
    // Filter by category if provided
    if (req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }
    
    // Filter by class if provided
    if (req.query.classId) {
      filter.classes = req.query.classId;
    }
    
    // Filter by teacher if provided
    if (req.query.teacherId) {
      filter.teachers = req.query.teacherId;
    }
    
    // Filter by elective status if provided
    if (req.query.isElective !== undefined) {
      filter.isElective = req.query.isElective === 'true';
    }
    
    const subjects = await Subject.find(filter)
      .populate('classes', 'name section')
      .populate('teachers', 'name email');
    
    return success(res, { 
      subjects, 
      count: subjects.length 
    }, 'Subjects retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve subjects', 500, err.message);
  }
};

/**
 * Get subject by ID
 * @route GET /api/subject/:id
 * @access Private/Admin/Teacher
 */
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('classes', 'name section')
      .populate('teachers', 'name email subjectSpecialization');
    
    if (!subject) {
      return error(res, 'Subject not found', 404);
    }
    
    return success(res, subject, 'Subject retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve subject', 500, err.message);
  }
};

/**
 * Create new subject
 * @route POST /api/subject
 * @access Private/Admin
 */
exports.createSubject = async (req, res) => {
  try {
    // Check if subject with this code already exists
    const existingSubject = await Subject.findOne({ code: req.body.code });
    if (existingSubject) {
      return error(res, 'Subject with this code already exists', 400);
    }
    
    // Validate classes if provided
    if (req.body.classes && req.body.classes.length > 0) {
      for (const classId of req.body.classes) {
        const classExists = await Class.findById(classId);
        if (!classExists) {
          return error(res, `Class with ID ${classId} not found`, 404);
        }
      }
    }
    
    // Validate teachers if provided
    if (req.body.teachers && req.body.teachers.length > 0) {
      for (const teacherId of req.body.teachers) {
        const teacherExists = await Teacher.findById(teacherId);
        if (!teacherExists) {
          return error(res, `Teacher with ID ${teacherId} not found`, 404);
        }
      }
    }
    
    // Create new subject
    const subject = new Subject({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      classes: req.body.classes || [],
      teachers: req.body.teachers || [],
      creditHours: req.body.creditHours,
      isElective: req.body.isElective,
      category: req.body.category
    });
    
    const savedSubject = await subject.save();
    
    // Return with populated data
    const populatedSubject = await Subject.findById(savedSubject._id)
      .populate('classes', 'name section')
      .populate('teachers', 'name email');
    
    return success(res, populatedSubject, 'Subject created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create subject', 500, err.message);
  }
};

/**
 * Update subject
 * @route PUT /api/subject/:id
 * @access Private/Admin
 */
exports.updateSubject = async (req, res) => {
  try {
    // Check if subject exists
    let subject = await Subject.findById(req.params.id);
    if (!subject) {
      return error(res, 'Subject not found', 404);
    }
    
    // If code is being changed, check if it's unique
    if (req.body.code && req.body.code !== subject.code) {
      const existingSubject = await Subject.findOne({ code: req.body.code });
      if (existingSubject) {
        return error(res, 'Subject with this code already exists', 400);
      }
    }
    
    // Validate classes if provided
    if (req.body.classes && req.body.classes.length > 0) {
      for (const classId of req.body.classes) {
        const classExists = await Class.findById(classId);
        if (!classExists) {
          return error(res, `Class with ID ${classId} not found`, 404);
        }
      }
    }
    
    // Validate teachers if provided
    if (req.body.teachers && req.body.teachers.length > 0) {
      for (const teacherId of req.body.teachers) {
        const teacherExists = await Teacher.findById(teacherId);
        if (!teacherExists) {
          return error(res, `Teacher with ID ${teacherId} not found`, 404);
        }
      }
    }
    
    // Update subject
    subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: Date.now()
        } 
      },
      { new: true, runValidators: true }
    )
      .populate('classes', 'name section')
      .populate('teachers', 'name email');
    
    return success(res, subject, 'Subject updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update subject', 500, err.message);
  }
};

/**
 * Delete subject
 * @route DELETE /api/subject/:id
 * @access Private/Admin
 */
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return error(res, 'Subject not found', 404);
    }
    
    await Subject.findByIdAndDelete(req.params.id);
    
    return success(res, { id: req.params.id }, 'Subject deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete subject', 500, err.message);
  }
};

/**
 * Get subjects by class
 * @route GET /api/subject/class/:classId
 * @access Private/Admin/Teacher/Student
 */
exports.getSubjectsByClass = async (req, res) => {
  try {
    // Check if class exists
    const classExists = await Class.findById(req.params.classId);
    if (!classExists) {
      return error(res, 'Class not found', 404);
    }
    
    const subjects = await Subject.find({ classes: req.params.classId })
      .populate('teachers', 'name email');
    
    return success(res, { 
      subjects, 
      count: subjects.length 
    }, 'Class subjects retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class subjects', 500, err.message);
  }
};

/**
 * Get subjects by teacher
 * @route GET /api/subject/teacher/:teacherId
 * @access Private/Admin/Teacher
 */
exports.getSubjectsByTeacher = async (req, res) => {
  try {
    // Check if teacher exists
    const teacherExists = await Teacher.findById(req.params.teacherId);
    if (!teacherExists) {
      return error(res, 'Teacher not found', 404);
    }
    
    const subjects = await Subject.find({ teachers: req.params.teacherId })
      .populate('classes', 'name section');
    
    return success(res, { 
      subjects, 
      count: subjects.length 
    }, 'Teacher subjects retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve teacher subjects', 500, err.message);
  }
};
