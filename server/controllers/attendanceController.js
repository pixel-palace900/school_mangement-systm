const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all attendance records
 * @route GET /api/attendance
 * @access Private/Admin/Teacher
 */
exports.getAllAttendance = async (req, res) => {
  try {
    // Support filtering by date range, student, or status
    const filter = {};
    
    // Filter by student ID if provided
    if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }
    
    // Filter by status if provided
    if (req.query.status && ['Present', 'Absent'].includes(req.query.status)) {
      filter.status = req.query.status;
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
    
    // Get attendance records with student details
    const attendance = await Attendance.find(filter)
      .populate('studentId', 'name email rollNumber')
      .sort({ date: -1 });
    
    return success(res, { 
      attendance, 
      count: attendance.length 
    }, 'Attendance records retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve attendance records', 500, err.message);
  }
};

/**
 * Get attendance by ID
 * @route GET /api/attendance/:id
 * @access Private/Admin/Teacher
 */
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('studentId', 'name email rollNumber');
    
    if (!attendance) {
      return error(res, 'Attendance record not found', 404);
    }
    
    return success(res, attendance, 'Attendance record retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve attendance record', 500, err.message);
  }
};

/**
 * Create new attendance record
 * @route POST /api/attendance
 * @access Private/Admin/Teacher
 */
exports.createAttendance = async (req, res) => {
  try {
    // Validate student exists
    const student = await Student.findById(req.body.studentId);
    if (!student) {
      return error(res, 'Student not found', 404);
    }
    
    // Check if attendance record already exists for this student on this date
    const attendanceDate = req.body.date ? new Date(req.body.date) : new Date();
    
    // Set time to beginning of day for comparison
    attendanceDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const existingAttendance = await Attendance.findOne({
      studentId: req.body.studentId,
      date: {
        $gte: attendanceDate,
        $lt: nextDay
      }
    });
    
    if (existingAttendance) {
      return error(res, 'Attendance record already exists for this student on this date', 400);
    }
    
    // Create new attendance record
    const attendance = new Attendance({
      studentId: req.body.studentId,
      date: req.body.date || new Date(),
      status: req.body.status || 'Present',
      remarks: req.body.remarks
    });
    
    const savedAttendance = await attendance.save();
    
    // Return with populated student data
    const populatedAttendance = await Attendance.findById(savedAttendance._id)
      .populate('studentId', 'name email rollNumber');
    
    return success(res, populatedAttendance, 'Attendance record created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create attendance record', 500, err.message);
  }
};

/**
 * Update attendance record
 * @route PUT /api/attendance/:id
 * @access Private/Admin/Teacher
 */
exports.updateAttendance = async (req, res) => {
  try {
    // Check if attendance record exists
    let attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return error(res, 'Attendance record not found', 404);
    }
    
    // If studentId is being updated, validate student exists
    if (req.body.studentId && req.body.studentId !== attendance.studentId.toString()) {
      const student = await Student.findById(req.body.studentId);
      if (!student) {
        return error(res, 'Student not found', 404);
      }
    }
    
    // Update attendance record
    attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('studentId', 'name email rollNumber');
    
    return success(res, attendance, 'Attendance record updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update attendance record', 500, err.message);
  }
};

/**
 * Delete attendance record
 * @route DELETE /api/attendance/:id
 * @access Private/Admin/Teacher
 */
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return error(res, 'Attendance record not found', 404);
    }
    
    await Attendance.findByIdAndDelete(req.params.id);
    
    return success(res, null, 'Attendance record deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete attendance record', 500, err.message);
  }
};

/**
 * Get attendance statistics
 * @route GET /api/attendance/stats
 * @access Private/Admin/Teacher
 */
exports.getAttendanceStats = async (req, res) => {
  try {
    // Default to current month if no date range provided
    let startDate, endDate;
    
    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
    }
    
    // Get total attendance count
    const totalAttendance = await Attendance.countDocuments({
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Get present attendance count
    const presentCount = await Attendance.countDocuments({
      date: { $gte: startDate, $lte: endDate },
      status: 'Present'
    });
    
    // Get absent attendance count
    const absentCount = await Attendance.countDocuments({
      date: { $gte: startDate, $lte: endDate },
      status: 'Absent'
    });
    
    // Calculate attendance percentage
    const attendancePercentage = totalAttendance > 0 
      ? (presentCount / totalAttendance) * 100 
      : 0;
    
    // Get student-wise attendance summary
    const studentAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$studentId',
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Present'] }, 1, 0]
            }
          },
          absentDays: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $unwind: '$studentDetails'
      },
      {
        $project: {
          _id: 1,
          studentName: '$studentDetails.name',
          rollNumber: '$studentDetails.rollNumber',
          totalDays: 1,
          presentDays: 1,
          absentDays: 1,
          attendancePercentage: {
            $multiply: [
              { $divide: ['$presentDays', '$totalDays'] },
              100
            ]
          }
        }
      },
      {
        $sort: { attendancePercentage: -1 }
      }
    ]);
    
    return success(res, {
      period: {
        startDate,
        endDate
      },
      summary: {
        totalAttendance,
        presentCount,
        absentCount,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
      },
      studentAttendance
    }, 'Attendance statistics retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve attendance statistics', 500, err.message);
  }
};
