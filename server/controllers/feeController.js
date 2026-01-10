const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { success, error } = require('../utils/responseHandler');

/**
 * Get all fees
 * @route GET /api/fee
 * @access Private/Admin
 */
exports.getAllFees = async (req, res) => {
  try {
    // Support filtering by student, status, or date range
    const filter = {};
    
    // Filter by student ID if provided
    if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }
    
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
    
    // Get fees with student details
    const fees = await Fee.find(filter)
      .populate('studentId', 'name email rollNumber')
      .sort({ dueDate: -1 });
    
    return success(res, { 
      fees, 
      count: fees.length 
    }, 'Fees retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve fees', 500, err.message);
  }
};

/**
 * Get fee by ID
 * @route GET /api/fee/:id
 * @access Private/Admin
 */
exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('studentId', 'name email rollNumber');
    
    if (!fee) {
      return error(res, 'Fee not found', 404);
    }
    
    return success(res, fee, 'Fee retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve fee', 500, err.message);
  }
};

/**
 * Create new fee
 * @route POST /api/fee
 * @access Private/Admin
 */
exports.createFee = async (req, res) => {
  try {
    // Validate student exists
    const student = await Student.findById(req.body.studentId);
    if (!student) {
      return error(res, 'Student not found', 404);
    }
    
    // Create new fee
    const fee = new Fee({
      studentId: req.body.studentId,
      amount: req.body.amount,
      dueDate: req.body.dueDate,
      paidDate: req.body.paidDate,
      status: req.body.status || 'unpaid'
    });
    
    const savedFee = await fee.save();
    
    // Return with populated student data
    const populatedFee = await Fee.findById(savedFee._id)
      .populate('studentId', 'name email rollNumber');
    
    return success(res, populatedFee, 'Fee created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create fee', 500, err.message);
  }
};

/**
 * Update fee
 * @route PUT /api/fee/:id
 * @access Private/Admin
 */
exports.updateFee = async (req, res) => {
  try {
    // Check if fee exists
    let fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return error(res, 'Fee not found', 404);
    }
    
    // If studentId is being updated, validate student exists
    if (req.body.studentId && req.body.studentId !== fee.studentId.toString()) {
      const student = await Student.findById(req.body.studentId);
      if (!student) {
        return error(res, 'Student not found', 404);
      }
    }
    
    // If status is being updated to 'paid', set paidDate to current date if not provided
    if (req.body.status === 'paid' && !req.body.paidDate && fee.status !== 'paid') {
      req.body.paidDate = new Date();
    }
    
    // Update fee
    fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('studentId', 'name email rollNumber');
    
    return success(res, fee, 'Fee updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update fee', 500, err.message);
  }
};

/**
 * Delete fee
 * @route DELETE /api/fee/:id
 * @access Private/Admin
 */
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return error(res, 'Fee not found', 404);
    }
    
    await Fee.findByIdAndDelete(req.params.id);
    
    return success(res, null, 'Fee deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete fee', 500, err.message);
  }
};

/**
 * Get fees by student
 * @route GET /api/fee/student/:studentId
 * @access Private/Admin/Parent
 */
exports.getFeesByStudent = async (req, res) => {
  try {
    // Check if student exists
    const student = await Student.findById(req.params.studentId);
    
    if (!student) {
      return error(res, 'Student not found', 404);
    }
    
    // Get fees for this student
    const fees = await Fee.find({ studentId: req.params.studentId })
      .populate('studentId', 'name email rollNumber')
      .sort({ dueDate: -1 });
    
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
 * Get pending fees
 * @route GET /api/fee/pending
 * @access Private/Admin
 */
exports.getPendingFees = async (req, res) => {
  try {
    // Get current date
    const today = new Date();
    
    // Get fees that are due and unpaid
    const fees = await Fee.find({
      status: 'unpaid',
      dueDate: { $lte: today }
    })
      .populate('studentId', 'name email rollNumber')
      .sort({ dueDate: 1 });
    
    return success(res, { 
      fees, 
      count: fees.length 
    }, 'Pending fees retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve pending fees', 500, err.message);
  }
};
