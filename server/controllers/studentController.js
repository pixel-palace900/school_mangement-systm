const Student = require('../models/Student');
const Class = require('../models/Class');
const Parent = require('../models/Parent');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all students
 * @route GET /api/student
 * @access Private/Admin/Teacher
 */
exports.getAllStudents = async (req, res) => {
  try {
    // Support filtering by name, class, or parent
    const filter = {};

    // Filter by name if provided
    if (req.query.name) {
      filter.name = { $regex: new RegExp(req.query.name, 'i') }; // Case-insensitive search
    }

    // Filter by class ID if provided
    if (req.query.classId) {
      filter.classId = req.query.classId;
    }

    // Filter by parent ID if provided
    if (req.query.parentId) {
      filter.parentId = req.query.parentId;
    }

    // Filter by roll number if provided
    if (req.query.rollNumber) {
      filter.rollNumber = req.query.rollNumber;
    }

    // Get students with class and parent details
    const students = await Student.find(filter)
      .select('-password')
      .populate('classId', 'name section')
      .populate('parentId', 'name email phone')
      .sort({ name: 1 });

    return success(res, {
      students,
      count: students.length
    }, 'Students retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve students', 500, err.message);
  }
};

/**
 * Get student by ID
 * @route GET /api/student/:id
 * @access Private/Admin/Teacher/Parent
 */
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password')
      .populate('classId', 'name section')
      .populate('parentId', 'name email phone');

    if (!student) {
      return error(res, 'Student not found', 404);
    }

    // If the request is from a parent, ensure they are the parent of this student
    if (req.user.role === 'parent' && student.parentId._id.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to student information', 403);
    }

    return success(res, student, 'Student retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve student', 500, err.message);
  }
};

/**
 * Create new student
 * @route POST /api/student
 * @access Private/Admin
 */
exports.createStudent = async (req, res) => {
  try {
    // Check if student with this email already exists
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return error(res, 'Student with this email already exists', 400);
    }

    // Check if roll number is already in use in the same class
    if (req.body.classId && req.body.rollNumber) {
      const studentWithRollNumber = await Student.findOne({
        classId: req.body.classId,
        rollNumber: req.body.rollNumber
      });

      if (studentWithRollNumber) {
        return error(res, 'Roll number already in use in this class', 400);
      }
    }

    // Validate class exists if classId is provided
    if (req.body.classId) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }

    // Validate parent exists if parentId is provided
    if (req.body.parentId) {
      const parentExists = await Parent.findById(req.body.parentId);
      if (!parentExists) {
        return error(res, 'Parent not found', 404);
      }
    }

    // Create new student
    const student = new Student({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // In a real app, this would be hashed
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      classId: req.body.classId,
      parentId: req.body.parentId,
      rollNumber: req.body.rollNumber
    });

    const savedStudent = await student.save();

    // Return with populated class and parent data
    const populatedStudent = await Student.findById(savedStudent._id)
      .select('-password')
      .populate('classId', 'name section')
      .populate('parentId', 'name email phone');

    return success(res, populatedStudent, 'Student created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create student', 500, err.message);
  }
};

/**
 * Update student
 * @route PUT /api/student/:id
 * @access Private/Admin
 */
exports.updateStudent = async (req, res) => {
  try {
    // Check if student exists
    let student = await Student.findById(req.params.id);

    if (!student) {
      return error(res, 'Student not found', 404);
    }

    // If email is being updated, check if it's already in use
    if (req.body.email && req.body.email !== student.email) {
      const existingStudent = await Student.findOne({ email: req.body.email });
      if (existingStudent) {
        return error(res, 'Email is already in use', 400);
      }
    }

    // If roll number is being updated, check if it's already in use in the same class
    const classId = req.body.classId || student.classId;
    if (req.body.rollNumber && req.body.rollNumber !== student.rollNumber) {
      const studentWithRollNumber = await Student.findOne({
        classId: classId,
        rollNumber: req.body.rollNumber,
        _id: { $ne: req.params.id } // Exclude current student
      });

      if (studentWithRollNumber) {
        return error(res, 'Roll number already in use in this class', 400);
      }
    }

    // Validate class exists if classId is being updated
    if (req.body.classId && req.body.classId !== student.classId?.toString()) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }

    // Validate parent exists if parentId is being updated
    if (req.body.parentId && req.body.parentId !== student.parentId?.toString()) {
      const parentExists = await Parent.findById(req.body.parentId);
      if (!parentExists) {
        return error(res, 'Parent not found', 404);
      }
    }

    // Update student
    student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('classId', 'name section')
      .populate('parentId', 'name email phone');

    return success(res, student, 'Student updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update student', 500, err.message);
  }
};

/**
 * Delete student
 * @route DELETE /api/student/:id
 * @access Private/Admin
 */
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return error(res, 'Student not found', 404);
    }

    // Check if there are attendance records for this student
    const attendanceCount = await Attendance.countDocuments({ studentId: req.params.id });

    // Check if there are fee records for this student
    const feeCount = await Fee.countDocuments({ studentId: req.params.id });

    if (attendanceCount > 0 || feeCount > 0) {
      return error(res, `Cannot delete student with ${attendanceCount} attendance records and ${feeCount} fee records. Please delete these records first.`, 400);
    }

    await Student.findByIdAndDelete(req.params.id);

    return success(res, null, 'Student deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete student', 500, err.message);
  }
};

/**
 * Get student profile (for student users)
 * @route GET /api/student/profile
 * @access Private/Student
 */
exports.getStudentProfile = async (req, res) => {
  try {
    // In a real application, this would use the authenticated user's ID
    // For now, we'll use the mock user from the auth middleware
    const student = await Student.findById(req.user.id)
      .select('-password')
      .populate('classId', 'name section')
      .populate('parentId', 'name email phone');

    if (!student) {
      return error(res, 'Student profile not found', 404);
    }

    return success(res, student, 'Student profile retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve student profile', 500, err.message);
  }
};

/**
 * Get student attendance
 * @route GET /api/student/:id/attendance
 * @access Private/Admin/Teacher/Parent/Student
 */
exports.getStudentAttendance = async (req, res) => {
  try {
    // Check if student exists
    const student = await Student.findById(req.params.id);

    if (!student) {
      return error(res, 'Student not found', 404);
    }

    // If the request is from a parent, ensure they are the parent of this student
    if (req.user.role === 'parent' && student.parentId.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to student attendance', 403);
    }

    // If the request is from a student, ensure they are requesting their own attendance
    if (req.user.role === 'student' && student._id.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to student attendance', 403);
    }

    // Support filtering by date range or status
    const filter = { studentId: req.params.id };

    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.date = { $lte: new Date(req.query.endDate) };
    }

    // Filter by status if provided
    if (req.query.status && ['Present', 'Absent'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    // Get attendance records
    const attendance = await Attendance.find(filter).sort({ date: -1 });

    return success(res, {
      attendance,
      count: attendance.length
    }, 'Student attendance retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve student attendance', 500, err.message);
  }
};

/**
 * Get student fees
 * @route GET /api/student/:id/fees
 * @access Private/Admin/Parent/Student
 */
exports.getStudentFees = async (req, res) => {
  try {
    // Check if student exists
    const student = await Student.findById(req.params.id);

    if (!student) {
      return error(res, 'Student not found', 404);
    }

    // If the request is from a parent, ensure they are the parent of this student
    if (req.user.role === 'parent' && student.parentId.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to student fees', 403);
    }

    // If the request is from a student, ensure they are requesting their own fees
    if (req.user.role === 'student' && student._id.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to student fees', 403);
    }

    // Support filtering by status or date range
    const filter = { studentId: req.params.id };

    // Filter by status if provided
    if (req.query.status && ['paid', 'unpaid'].includes(req.query.status)) {
      filter.status = req.query.status;
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

    // Get fees
    const fees = await Fee.find(filter).sort({ dueDate: -1 });

    return success(res, {
      fees,
      count: fees.length
    }, 'Student fees retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve student fees', 500, err.message);
  }
};

/**
 * Get student assignments
 * @route GET /api/student/assignments
 * @access Private/Student
 */
exports.getStudentAssignments = async (req, res) => {
  try {
    // Get the student's profile to find their class
    const student = await Student.findById(req.user.id).populate('classId');

    if (!student) {
      return error(res, 'Student not found', 404);
    }

    // Get all assignments for the student's class
    const assignments = await Assignment.find({ classId: student.classId._id })
      .populate('assignedBy', 'name email')
      .populate('classId', 'name section')
      .sort({ dueDate: 1 });

    // Get all submissions for this student
    const submissions = await AssignmentSubmission.find({ studentId: req.user.id })
      .populate('assignmentId');

    // Create a map of submissions by assignment ID for quick lookup
    const submissionMap = {};
    submissions.forEach(submission => {
      submissionMap[submission.assignmentId._id.toString()] = submission;
    });

    // Categorize assignments into pending and completed
    const pending = [];
    const completed = [];

    assignments.forEach(assignment => {
      const submission = submissionMap[assignment._id.toString()];

      if (submission) {
        // Assignment has been submitted
        completed.push({
          ...assignment.toObject(),
          submittedDate: submission.submissionDate,
          marksObtained: submission.marksObtained,
          feedback: submission.feedback,
          status: submission.status,
          grade: submission.marksObtained && assignment.maxMarks
            ? getGradeFromMarks(submission.marksObtained, assignment.maxMarks)
            : null
        });
      } else {
        // Assignment is pending
        pending.push(assignment.toObject());
      }
    });

    return success(res, {
      pending,
      completed,
      totalAssignments: assignments.length,
      pendingCount: pending.length,
      completedCount: completed.length
    }, 'Student assignments retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve student assignments', 500, err.message);
  }
};

// Helper function to calculate grade from marks
function getGradeFromMarks(marksObtained, maxMarks) {
  const percentage = (marksObtained / maxMarks) * 100;

  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'A-';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  if (percentage >= 55) return 'C-';
  if (percentage >= 50) return 'D';
  return 'F';
}
