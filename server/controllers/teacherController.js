const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all teachers
 * @route GET /api/teacher
 * @access Private/Admin
 */
exports.getAllTeachers = async (req, res) => {
  try {
    // Support filtering by name, email, or subject specialization
    const filter = {};
    
    // Filter by name if provided (case-insensitive partial match)
    if (req.query.name) {
      filter.name = { $regex: new RegExp(req.query.name, 'i') };
    }
    
    // Filter by email if provided (case-insensitive partial match)
    if (req.query.email) {
      filter.email = { $regex: new RegExp(req.query.email, 'i') };
    }
    
    // Filter by subject specialization if provided
    if (req.query.subjectSpecialization) {
      filter.subjectSpecialization = { $regex: new RegExp(req.query.subjectSpecialization, 'i') };
    }
    
    // Filter by class assigned if provided
    if (req.query.classAssigned) {
      filter.classAssigned = req.query.classAssigned;
    }
    
    const teachers = await Teacher.find(filter)
      .select('-password')
      .populate('classAssigned', 'name section');
    
    return success(res, { 
      teachers, 
      count: teachers.length 
    }, 'Teachers retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve teachers', 500, err.message);
  }
};

/**
 * Get teacher by ID
 * @route GET /api/teacher/:id
 * @access Private/Admin/Teacher
 */
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .select('-password')
      .populate('classAssigned', 'name section');
    
    if (!teacher) {
      return error(res, 'Teacher not found', 404);
    }
    
    // If the request is from a teacher, ensure they are accessing their own profile
    if (req.user.role === 'teacher' && teacher._id.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to teacher information', 403);
    }
    
    return success(res, teacher, 'Teacher retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve teacher', 500, err.message);
  }
};

/**
 * Get teacher profile (for teacher users)
 * @route GET /api/teacher/profile
 * @access Private/Teacher
 */
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id)
      .select('-password')
      .populate('classAssigned', 'name section');
    
    if (!teacher) {
      return error(res, 'Teacher not found', 404);
    }
    
    return success(res, teacher, 'Teacher profile retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve teacher profile', 500, err.message);
  }
};

/**
 * Create new teacher
 * @route POST /api/teacher
 * @access Private/Admin
 */
exports.createTeacher = async (req, res) => {
  try {
    // Check if teacher with this email already exists
    const existingTeacher = await Teacher.findOne({ email: req.body.email });
    if (existingTeacher) {
      return error(res, 'Teacher with this email already exists', 400);
    }
    
    // Validate class exists if classAssigned is provided
    if (req.body.classAssigned) {
      const classExists = await Class.findById(req.body.classAssigned);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }
    
    // Create new teacher
    const teacher = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // In a real app, this should be hashed
      phone: req.body.phone,
      subjectSpecialization: req.body.subjectSpecialization,
      classAssigned: req.body.classAssigned
    });
    
    const savedTeacher = await teacher.save();
    
    // If a class is assigned, update the class with this teacher as the class teacher
    if (req.body.classAssigned) {
      await Class.findByIdAndUpdate(
        req.body.classAssigned,
        { classTeacher: savedTeacher._id }
      );
    }
    
    // Return with populated class data but without password
    const populatedTeacher = await Teacher.findById(savedTeacher._id)
      .select('-password')
      .populate('classAssigned', 'name section');
    
    return success(res, populatedTeacher, 'Teacher created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create teacher', 500, err.message);
  }
};

/**
 * Update teacher
 * @route PUT /api/teacher/:id
 * @access Private/Admin
 */
exports.updateTeacher = async (req, res) => {
  try {
    // Check if teacher exists
    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return error(res, 'Teacher not found', 404);
    }
    
    // If email is being changed, check if it's unique
    if (req.body.email && req.body.email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ email: req.body.email });
      if (existingTeacher) {
        return error(res, 'Teacher with this email already exists', 400);
      }
    }
    
    // If class is being changed, validate it exists
    if (req.body.classAssigned && req.body.classAssigned !== teacher.classAssigned?.toString()) {
      const classExists = await Class.findById(req.body.classAssigned);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
      
      // If teacher was previously assigned to a class, remove them as class teacher
      if (teacher.classAssigned) {
        const previousClass = await Class.findById(teacher.classAssigned);
        if (previousClass && previousClass.classTeacher?.toString() === teacher._id.toString()) {
          previousClass.classTeacher = null;
          await previousClass.save();
        }
      }
      
      // Update the new class with this teacher as class teacher
      await Class.findByIdAndUpdate(
        req.body.classAssigned,
        { classTeacher: teacher._id }
      );
    }
    
    // Update teacher
    teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('classAssigned', 'name section');
    
    return success(res, teacher, 'Teacher updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update teacher', 500, err.message);
  }
};

/**
 * Delete teacher
 * @route DELETE /api/teacher/:id
 * @access Private/Admin
 */
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return error(res, 'Teacher not found', 404);
    }
    
    // If teacher is assigned to a class, remove them as class teacher
    if (teacher.classAssigned) {
      const classItem = await Class.findById(teacher.classAssigned);
      if (classItem && classItem.classTeacher?.toString() === teacher._id.toString()) {
        classItem.classTeacher = null;
        await classItem.save();
      }
    }
    
    // Remove teacher from any subjects they teach
    await Subject.updateMany(
      { teachers: teacher._id },
      { $pull: { teachers: teacher._id } }
    );
    
    await Teacher.findByIdAndDelete(req.params.id);
    
    return success(res, { id: req.params.id }, 'Teacher deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete teacher', 500, err.message);
  }
};

/**
 * Get teachers by subject
 * @route GET /api/teacher/subject/:subjectId
 * @access Private/Admin
 */
exports.getTeachersBySubject = async (req, res) => {
  try {
    // Check if subject exists
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return error(res, 'Subject not found', 404);
    }
    
    // Get teachers assigned to this subject
    const teachers = await Teacher.find({ _id: { $in: subject.teachers } })
      .select('-password')
      .populate('classAssigned', 'name section');
    
    return success(res, { 
      teachers, 
      count: teachers.length 
    }, 'Subject teachers retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve subject teachers', 500, err.message);
  }
};

/**
 * Get teachers by class
 * @route GET /api/teacher/class/:classId
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getTeachersByClass = async (req, res) => {
  try {
    // Check if class exists
    const classExists = await Class.findById(req.params.classId);
    if (!classExists) {
      return error(res, 'Class not found', 404);
    }
    
    // Get class teacher
    const classTeacher = await Teacher.findById(classExists.classTeacher)
      .select('-password');
    
    // Get all teachers who teach subjects in this class
    const subjects = await Subject.find({ classes: req.params.classId });
    const teacherIds = subjects.reduce((ids, subject) => {
      return [...ids, ...subject.teachers];
    }, []);
    
    // Remove duplicates
    const uniqueTeacherIds = [...new Set(teacherIds.map(id => id.toString()))];
    
    // Get subject teachers
    const subjectTeachers = await Teacher.find({ 
      _id: { $in: uniqueTeacherIds },
      _id: { $ne: classExists.classTeacher } // Exclude class teacher
    }).select('-password');
    
    return success(res, { 
      classTeacher,
      subjectTeachers,
      count: subjectTeachers.length + (classTeacher ? 1 : 0)
    }, 'Class teachers retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class teachers', 500, err.message);
  }
};
