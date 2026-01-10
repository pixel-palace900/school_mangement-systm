const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all timetable entries
 * @route GET /api/timetable
 * @access Private/Admin/Teacher
 */
exports.getAllTimetables = async (req, res) => {
  try {
    // Support filtering by class, day, or teacher
    const filter = {};
    
    // Filter by class ID if provided
    if (req.query.classId) {
      filter.classId = req.query.classId;
    }
    
    // Filter by day of week if provided
    if (req.query.dayOfWeek) {
      filter.dayOfWeek = req.query.dayOfWeek;
    }
    
    // Filter by teacher ID if provided
    if (req.query.teacherId) {
      filter.teacherId = req.query.teacherId;
    }
    
    // Filter by subject if provided
    if (req.query.subject) {
      filter.subject = { $regex: new RegExp(req.query.subject, 'i') };
    }
    
    // Filter by period number if provided
    if (req.query.periodNumber) {
      filter.periodNumber = req.query.periodNumber;
    }
    
    const timetables = await Timetable.find(filter)
      .populate('classId', 'name section')
      .populate('teacherId', 'name email subjectSpecialization')
      .sort({ dayOfWeek: 1, periodNumber: 1 });
    
    return success(res, { 
      timetables, 
      count: timetables.length 
    }, 'Timetable entries retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve timetable entries', 500, err.message);
  }
};

/**
 * Get timetable entry by ID
 * @route GET /api/timetable/:id
 * @access Private/Admin/Teacher
 */
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('classId', 'name section')
      .populate('teacherId', 'name email subjectSpecialization');
    
    if (!timetable) {
      return error(res, 'Timetable entry not found', 404);
    }
    
    return success(res, timetable, 'Timetable entry retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve timetable entry', 500, err.message);
  }
};

/**
 * Create new timetable entry
 * @route POST /api/timetable
 * @access Private/Admin
 */
exports.createTimetable = async (req, res) => {
  try {
    // Validate class exists
    if (req.body.classId) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }
    
    // Validate teacher exists
    if (req.body.teacherId) {
      const teacherExists = await Teacher.findById(req.body.teacherId);
      if (!teacherExists) {
        return error(res, 'Teacher not found', 404);
      }
    }
    
    // Check for scheduling conflicts
    const conflict = await checkSchedulingConflict(
      null,
      req.body.classId,
      req.body.teacherId,
      req.body.dayOfWeek,
      req.body.periodNumber
    );
    
    if (conflict) {
      return error(res, conflict, 400);
    }
    
    // Create new timetable entry
    const timetable = new Timetable({
      classId: req.body.classId,
      dayOfWeek: req.body.dayOfWeek,
      periodNumber: req.body.periodNumber,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      subject: req.body.subject,
      teacherId: req.body.teacherId
    });
    
    const savedTimetable = await timetable.save();
    
    // Return with populated data
    const populatedTimetable = await Timetable.findById(savedTimetable._id)
      .populate('classId', 'name section')
      .populate('teacherId', 'name email subjectSpecialization');
    
    return success(res, populatedTimetable, 'Timetable entry created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create timetable entry', 500, err.message);
  }
};

/**
 * Update timetable entry
 * @route PUT /api/timetable/:id
 * @access Private/Admin
 */
exports.updateTimetable = async (req, res) => {
  try {
    // Check if timetable entry exists
    let timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return error(res, 'Timetable entry not found', 404);
    }
    
    // Validate class exists if being updated
    if (req.body.classId && req.body.classId !== timetable.classId?.toString()) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return error(res, 'Class not found', 404);
      }
    }
    
    // Validate teacher exists if being updated
    if (req.body.teacherId && req.body.teacherId !== timetable.teacherId?.toString()) {
      const teacherExists = await Teacher.findById(req.body.teacherId);
      if (!teacherExists) {
        return error(res, 'Teacher not found', 404);
      }
    }
    
    // Check for scheduling conflicts if day or period is changing
    if (
      req.body.dayOfWeek !== undefined || 
      req.body.periodNumber !== undefined ||
      req.body.classId !== undefined ||
      req.body.teacherId !== undefined
    ) {
      const conflict = await checkSchedulingConflict(
        req.params.id,
        req.body.classId || timetable.classId,
        req.body.teacherId || timetable.teacherId,
        req.body.dayOfWeek || timetable.dayOfWeek,
        req.body.periodNumber || timetable.periodNumber
      );
      
      if (conflict) {
        return error(res, conflict, 400);
      }
    }
    
    // Update timetable entry
    timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('classId', 'name section')
      .populate('teacherId', 'name email subjectSpecialization');
    
    return success(res, timetable, 'Timetable entry updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update timetable entry', 500, err.message);
  }
};

/**
 * Delete timetable entry
 * @route DELETE /api/timetable/:id
 * @access Private/Admin
 */
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    
    if (!timetable) {
      return error(res, 'Timetable entry not found', 404);
    }
    
    await Timetable.findByIdAndDelete(req.params.id);
    
    return success(res, { id: req.params.id }, 'Timetable entry deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete timetable entry', 500, err.message);
  }
};

/**
 * Get timetable by class
 * @route GET /api/timetable/class/:classId
 * @access Private/Admin/Teacher/Student/Parent
 */
exports.getTimetableByClass = async (req, res) => {
  try {
    // Check if class exists
    const classExists = await Class.findById(req.params.classId);
    if (!classExists) {
      return error(res, 'Class not found', 404);
    }
    
    // Get timetable entries for this class
    const timetables = await Timetable.find({ classId: req.params.classId })
      .populate('teacherId', 'name email subjectSpecialization')
      .sort({ dayOfWeek: 1, periodNumber: 1 });
    
    // Organize by day of week
    const timetableByDay = {
      Monday: timetables.filter(t => t.dayOfWeek === 'Monday'),
      Tuesday: timetables.filter(t => t.dayOfWeek === 'Tuesday'),
      Wednesday: timetables.filter(t => t.dayOfWeek === 'Wednesday'),
      Thursday: timetables.filter(t => t.dayOfWeek === 'Thursday'),
      Friday: timetables.filter(t => t.dayOfWeek === 'Friday'),
      Saturday: timetables.filter(t => t.dayOfWeek === 'Saturday'),
      Sunday: timetables.filter(t => t.dayOfWeek === 'Sunday')
    };
    
    return success(res, { 
      timetableByDay,
      class: {
        id: classExists._id,
        name: classExists.name,
        section: classExists.section
      }
    }, 'Class timetable retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve class timetable', 500, err.message);
  }
};

/**
 * Get timetable by teacher
 * @route GET /api/timetable/teacher/:teacherId
 * @access Private/Admin/Teacher
 */
exports.getTimetableByTeacher = async (req, res) => {
  try {
    // Check if teacher exists
    const teacherExists = await Teacher.findById(req.params.teacherId);
    if (!teacherExists) {
      return error(res, 'Teacher not found', 404);
    }
    
    // If the request is from a teacher, ensure they are accessing their own timetable
    if (req.user.role === 'teacher' && teacherExists._id.toString() !== req.user.id) {
      return error(res, 'Unauthorized access to teacher timetable', 403);
    }
    
    // Get timetable entries for this teacher
    const timetables = await Timetable.find({ teacherId: req.params.teacherId })
      .populate('classId', 'name section')
      .sort({ dayOfWeek: 1, periodNumber: 1 });
    
    // Organize by day of week
    const timetableByDay = {
      Monday: timetables.filter(t => t.dayOfWeek === 'Monday'),
      Tuesday: timetables.filter(t => t.dayOfWeek === 'Tuesday'),
      Wednesday: timetables.filter(t => t.dayOfWeek === 'Wednesday'),
      Thursday: timetables.filter(t => t.dayOfWeek === 'Thursday'),
      Friday: timetables.filter(t => t.dayOfWeek === 'Friday'),
      Saturday: timetables.filter(t => t.dayOfWeek === 'Saturday'),
      Sunday: timetables.filter(t => t.dayOfWeek === 'Sunday')
    };
    
    return success(res, { 
      timetableByDay,
      teacher: {
        id: teacherExists._id,
        name: teacherExists.name,
        email: teacherExists.email,
        subjectSpecialization: teacherExists.subjectSpecialization
      }
    }, 'Teacher timetable retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve teacher timetable', 500, err.message);
  }
};

/**
 * Helper function to check for scheduling conflicts
 * @param {String} currentId - ID of the current timetable entry (for updates)
 * @param {String} classId - Class ID
 * @param {String} teacherId - Teacher ID
 * @param {String} dayOfWeek - Day of the week
 * @param {Number} periodNumber - Period number
 * @returns {String|null} - Error message or null if no conflict
 */
async function checkSchedulingConflict(currentId, classId, teacherId, dayOfWeek, periodNumber) {
  // Check if the class already has a timetable entry for this day and period
  const classConflict = await Timetable.findOne({
    _id: { $ne: currentId }, // Exclude current entry for updates
    classId: classId,
    dayOfWeek: dayOfWeek,
    periodNumber: periodNumber
  });
  
  if (classConflict) {
    return `Class already has a timetable entry for ${dayOfWeek}, period ${periodNumber}`;
  }
  
  // Check if the teacher already has a timetable entry for this day and period
  const teacherConflict = await Timetable.findOne({
    _id: { $ne: currentId }, // Exclude current entry for updates
    teacherId: teacherId,
    dayOfWeek: dayOfWeek,
    periodNumber: periodNumber
  });
  
  if (teacherConflict) {
    return `Teacher already has a timetable entry for ${dayOfWeek}, period ${periodNumber}`;
  }
  
  return null;
}
