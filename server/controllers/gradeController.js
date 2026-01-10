const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Exam = require('../models/Exam');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all grades
 * @route GET /api/grade
 * @access Private/Admin/Teacher
 */
exports.getAllGrades = async (req, res) => {
  try {
    // Support filtering by student, exam, or teacher
    const filter = {};
    
    // Filter by student ID if provided
    if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }
    
    // Filter by exam ID if provided
    if (req.query.examId) {
      filter.examId = req.query.examId;
    }
    
    // Filter by teacher ID if provided
    if (req.query.gradedBy) {
      filter.gradedBy = req.query.gradedBy;
    }
    
    // Get grades with student and exam details
    const grades = await Grade.find(filter)
      .populate('studentId', 'name email rollNumber')
      .populate('examId', 'title subject date maxMarks passMarks')
      .populate('gradedBy', 'name email')
      .sort({ gradedAt: -1 });
    
    return success(res, { 
      grades, 
      count: grades.length 
    }, 'Grades retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve grades', 500, err.message);
  }
};

/**
 * Get grade by ID
 * @route GET /api/grade/:id
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('studentId', 'name email rollNumber classId')
      .populate('examId', 'title subject date maxMarks passMarks')
      .populate('gradedBy', 'name email');
    
    if (!grade) {
      return error(res, 'Grade not found', 404);
    }
    
    // Access control based on user role
    if (req.user.role === 'student' && grade.studentId._id.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to grade information', 403);
    }
    
    if (req.user.role === 'parent') {
      // Check if the student is a child of this parent
      const student = await Student.findById(grade.studentId._id);
      if (!student || student.parentId.toString() !== req.user.id) {
        return error(res, 'Unauthorized access to grade information', 403);
      }
    }
    
    return success(res, grade, 'Grade retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve grade', 500, err.message);
  }
};

/**
 * Create new grade
 * @route POST /api/grade
 * @access Private/Admin/Teacher
 */
exports.createGrade = async (req, res) => {
  try {
    // Validate student exists
    const student = await Student.findById(req.body.studentId);
    if (!student) {
      return error(res, 'Student not found', 404);
    }
    
    // Validate exam exists
    const exam = await Exam.findById(req.body.examId);
    if (!exam) {
      return error(res, 'Exam not found', 404);
    }
    
    // Check if grade already exists for this student and exam
    const existingGrade = await Grade.findOne({
      studentId: req.body.studentId,
      examId: req.body.examId
    });
    
    if (existingGrade) {
      return error(res, 'Grade already exists for this student and exam', 400);
    }
    
    // Validate marks obtained is not greater than max marks
    if (req.body.marksObtained > exam.maxMarks) {
      return error(res, `Marks obtained cannot be greater than maximum marks (${exam.maxMarks})`, 400);
    }
    
    // Create new grade
    const grade = new Grade({
      studentId: req.body.studentId,
      examId: req.body.examId,
      marksObtained: req.body.marksObtained,
      remarks: req.body.remarks,
      gradedBy: req.user.id
    });
    
    const savedGrade = await grade.save();
    
    // Return with populated data
    const populatedGrade = await Grade.findById(savedGrade._id)
      .populate('studentId', 'name email rollNumber')
      .populate('examId', 'title subject date maxMarks passMarks')
      .populate('gradedBy', 'name email');
    
    return success(res, populatedGrade, 'Grade created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create grade', 500, err.message);
  }
};

/**
 * Update grade
 * @route PUT /api/grade/:id
 * @access Private/Admin/Teacher
 */
exports.updateGrade = async (req, res) => {
  try {
    // Check if grade exists
    let grade = await Grade.findById(req.params.id);
    
    if (!grade) {
      return error(res, 'Grade not found', 404);
    }
    
    // If teacher, check if they are the one who graded it
    if (req.user.role === 'teacher' && grade.gradedBy.toString() !== req.user.id) {
      return error(res, 'You can only update grades that you have created', 403);
    }
    
    // If marks obtained is being updated, validate it's not greater than max marks
    if (req.body.marksObtained !== undefined) {
      const exam = await Exam.findById(grade.examId);
      if (req.body.marksObtained > exam.maxMarks) {
        return error(res, `Marks obtained cannot be greater than maximum marks (${exam.maxMarks})`, 400);
      }
    }
    
    // Update grade
    grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: Date.now()
        } 
      },
      { new: true, runValidators: true }
    )
      .populate('studentId', 'name email rollNumber')
      .populate('examId', 'title subject date maxMarks passMarks')
      .populate('gradedBy', 'name email');
    
    return success(res, grade, 'Grade updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update grade', 500, err.message);
  }
};

/**
 * Delete grade
 * @route DELETE /api/grade/:id
 * @access Private/Admin/Teacher
 */
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    
    if (!grade) {
      return error(res, 'Grade not found', 404);
    }
    
    // If teacher, check if they are the one who graded it
    if (req.user.role === 'teacher' && grade.gradedBy.toString() !== req.user.id) {
      return error(res, 'You can only delete grades that you have created', 403);
    }
    
    await grade.remove();
    
    return success(res, null, 'Grade deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete grade', 500, err.message);
  }
};

/**
 * Get grades by student
 * @route GET /api/grade/student/:studentId
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getGradesByStudent = async (req, res) => {
  try {
    // Check if student exists
    const student = await Student.findById(req.params.studentId);
    
    if (!student) {
      return error(res, 'Student not found', 404);
    }
    
    // Access control based on user role
    if (req.user.role === 'student' && req.params.studentId !== req.user.id) {
      return error(res, 'Unauthorized access to grade information', 403);
    }
    
    if (req.user.role === 'parent') {
      // Check if the student is a child of this parent
      if (student.parentId.toString() !== req.user.id) {
        return error(res, 'Unauthorized access to grade information', 403);
      }
    }
    
    // Get grades for this student
    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate('examId', 'title subject date maxMarks passMarks')
      .populate('gradedBy', 'name email')
      .sort({ 'examId.date': -1 });
    
    return success(res, { 
      grades, 
      count: grades.length 
    }, 'Student grades retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve student grades', 500, err.message);
  }
};

/**
 * Get grades by exam
 * @route GET /api/grade/exam/:examId
 * @access Private/Admin/Teacher
 */
exports.getGradesByExam = async (req, res) => {
  try {
    // Check if exam exists
    const exam = await Exam.findById(req.params.examId);
    
    if (!exam) {
      return error(res, 'Exam not found', 404);
    }
    
    // Get grades for this exam
    const grades = await Grade.find({ examId: req.params.examId })
      .populate('studentId', 'name email rollNumber classId')
      .populate('gradedBy', 'name email')
      .sort({ marksObtained: -1 });
    
    return success(res, { 
      grades, 
      count: grades.length,
      examDetails: exam
    }, 'Exam grades retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve exam grades', 500, err.message);
  }
};
