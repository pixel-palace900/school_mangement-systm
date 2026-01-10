const Exam = require('../models/Exam');
const Class = require('../models/Class');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all exams
 * @route GET /api/exam
 * @access Private/Admin/Teacher
 */
exports.getAllExams = async (req, res) => {
  try {
    // Support filtering by class, subject, or date range
    const filter = {};
    
    // Filter by class ID if provided
    if (req.query.classId) {
      filter.classId = req.query.classId;
    }
    
    // Filter by subject if provided
    if (req.query.subject) {
      filter.subject = { $regex: new RegExp(req.query.subject, 'i') }; // Case-insensitive search
    }
    
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
    } else if (req.query.date) {
      // For a specific date
      const specificDate = new Date(req.query.date);
      const nextDay = new Date(specificDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: specificDate,
        $lt: nextDay
      };
    }
    
    // Get exams with class details
    const exams = await Exam.find(filter)
      .populate('classId', 'name section')
      .sort({ date: 1, startTime: 1 }); // Sort by date and then by start time
    
    return success(res, { 
      exams, 
      count: exams.length 
    }, 'Exams retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve exams', 500, err.message);
  }
};

/**
 * Get exam by ID
 * @route GET /api/exam/:id
 * @access Private/Admin/Teacher
 */
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('classId', 'name section');
    
    if (!exam) {
      return error(res, 'Exam not found', 404);
    }
    
    return success(res, exam, 'Exam retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve exam', 500, err.message);
  }
};

/**
 * Create new exam
 * @route POST /api/exam
 * @access Private/Admin/Teacher
 */
exports.createExam = async (req, res) => {
  try {
    // Validate class exists if classId is provided
    if (req.body.classId) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }
    
    // Create new exam
    const exam = new Exam({
      title: req.body.title,
      classId: req.body.classId,
      subject: req.body.subject,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      maxMarks: req.body.maxMarks,
      passMarks: req.body.passMarks
    });
    
    const savedExam = await exam.save();
    
    // Return with populated class data
    const populatedExam = await Exam.findById(savedExam._id)
      .populate('classId', 'name section');
    
    return success(res, populatedExam, 'Exam created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create exam', 500, err.message);
  }
};

/**
 * Update exam
 * @route PUT /api/exam/:id
 * @access Private/Admin/Teacher
 */
exports.updateExam = async (req, res) => {
  try {
    // Check if exam exists
    let exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return error(res, 'Exam not found', 404);
    }
    
    // If classId is being updated, validate class exists
    if (req.body.classId && req.body.classId !== exam.classId?.toString()) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }
    
    // Update exam
    exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('classId', 'name section');
    
    return success(res, exam, 'Exam updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update exam', 500, err.message);
  }
};

/**
 * Delete exam
 * @route DELETE /api/exam/:id
 * @access Private/Admin/Teacher
 */
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return error(res, 'Exam not found', 404);
    }
    
    await Exam.findByIdAndDelete(req.params.id);
    
    return success(res, null, 'Exam deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete exam', 500, err.message);
  }
};

/**
 * Get exams by class
 * @route GET /api/exam/class/:classId
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getExamsByClass = async (req, res) => {
  try {
    // Check if class exists
    const classExists = await Class.findById(req.params.classId);
    
    if (!classExists) {
      return error(res, 'Class not found', 404);
    }
    
    // Get exams for this class
    const exams = await Exam.find({ classId: req.params.classId })
      .populate('classId', 'name section')
      .sort({ date: 1, startTime: 1 });
    
    return success(res, { 
      exams, 
      count: exams.length 
    }, 'Class exams retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class exams', 500, err.message);
  }
};

/**
 * Get upcoming exams
 * @route GET /api/exam/upcoming
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getUpcomingExams = async (req, res) => {
  try {
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter by class ID if provided
    const filter = {
      date: { $gte: today }
    };
    
    if (req.query.classId) {
      filter.classId = req.query.classId;
    }
    
    // Get upcoming exams
    const exams = await Exam.find(filter)
      .populate('classId', 'name section')
      .sort({ date: 1, startTime: 1 })
      .limit(req.query.limit ? parseInt(req.query.limit) : 10);
    
    return success(res, { 
      exams, 
      count: exams.length 
    }, 'Upcoming exams retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve upcoming exams', 500, err.message);
  }
};
