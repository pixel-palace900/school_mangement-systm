const { error } = require('../utils/responseHandler');

/**
 * Validate fee data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateFee = (req, res, next) => {
  const { studentId, amount, dueDate } = req.body;

  // Check required fields
  if (!studentId) {
    return error(res, 'Student ID is required', 400);
  }

  if (!amount) {
    return error(res, 'Fee amount is required', 400);
  }

  if (!dueDate) {
    return error(res, 'Due date is required', 400);
  }

  // Validate amount is a positive number
  if (isNaN(amount) || amount <= 0) {
    return error(res, 'Fee amount must be a positive number', 400);
  }

  // Validate date format
  try {
    new Date(dueDate);
  } catch (err) {
    return error(res, 'Invalid due date format', 400);
  }

  next();
};

/**
 * Validate subject data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateSubject = (req, res, next) => {
  const { name, code } = req.body;

  // Check required fields
  if (!name) {
    return error(res, 'Subject name is required', 400);
  }

  if (!code) {
    return error(res, 'Subject code is required', 400);
  }

  // Validate code format (alphanumeric, no spaces)
  const codeRegex = /^[A-Za-z0-9-_]+$/;
  if (!codeRegex.test(code)) {
    return error(res, 'Subject code must contain only letters, numbers, hyphens, and underscores', 400);
  }

  // Validate credit hours if provided
  if (req.body.creditHours !== undefined) {
    const creditHours = Number(req.body.creditHours);
    if (isNaN(creditHours) || creditHours <= 0) {
      return error(res, 'Credit hours must be a positive number', 400);
    }
  }

  // Validate isElective if provided
  if (req.body.isElective !== undefined && typeof req.body.isElective !== 'boolean') {
    return error(res, 'isElective must be a boolean value', 400);
  }

  next();
};

/**
 * Validate admin data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateAdmin = (req, res, next) => {
  const { name, email, password, phone, role, employeeId, joiningDate } = req.body;

  // Check required fields
  if (!name) {
    return error(res, 'Admin name is required', 400);
  }

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  // Password is required only for new admins
  if (!req.params.id && !password) {
    return error(res, 'Password is required for new admins', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return error(res, 'Invalid email format', 400);
  }

  // Validate password strength if provided
  if (password && password.length < 6) {
    return error(res, 'Password must be at least 6 characters long', 400);
  }

  // Validate phone if provided
  if (phone) {
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      return error(res, 'Invalid phone number format', 400);
    }
  }

  // Validate role if provided
  if (role && !['admin', 'super_admin'].includes(role)) {
    return error(res, 'Invalid role. Must be either "admin" or "super_admin"', 400);
  }

  // Validate employeeId format if provided
  if (employeeId && (typeof employeeId !== 'string' || employeeId.trim().length === 0)) {
    return error(res, 'Employee ID must be a non-empty string', 400);
  }

  // Validate joiningDate if provided
  if (joiningDate) {
    const date = new Date(joiningDate);
    if (isNaN(date.getTime())) {
      return error(res, 'Invalid joining date format', 400);
    }

    // Check if joining date is not in the future
    if (date > new Date()) {
      return error(res, 'Joining date cannot be in the future', 400);
    }
  }

  // Validate profileUrl if provided
  if (req.body.profileUrl && typeof req.body.profileUrl !== 'string') {
    return error(res, 'Profile URL must be a string', 400);
  }

  // Validate address if provided
  if (req.body.address && typeof req.body.address !== 'string') {
    return error(res, 'Address must be a string', 400);
  }

  // Validate bio if provided
  if (req.body.bio && typeof req.body.bio !== 'string') {
    return error(res, 'Bio must be a string', 400);
  }

  next();
};

/**
 * Validate teacher data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateTeacher = (req, res, next) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name) {
    return error(res, 'Teacher name is required', 400);
  }

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  // Password is required only for new teachers
  if (!req.params.id && !password) {
    return error(res, 'Password is required for new teachers', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return error(res, 'Invalid email format', 400);
  }

  // Validate password strength if provided
  if (password && password.length < 6) {
    return error(res, 'Password must be at least 6 characters long', 400);
  }

  // Validate phone if provided
  if (req.body.phone) {
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(req.body.phone.replace(/[^0-9]/g, ''))) {
      return error(res, 'Invalid phone number format', 400);
    }
  }

  next();
};

/**
 * Validate class data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateClass = (req, res, next) => {
  // Implementation for class validation
  next();
};

/**
 * Validate exam data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateExam = (req, res, next) => {
  // Implementation for exam validation
  next();
};

/**
 * Validate attendance data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateAttendance = (req, res, next) => {
  // Implementation for attendance validation
  next();
};

/**
 * Validate notification data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateNotification = (req, res, next) => {
  const { title, message, type } = req.body;

  // Check required fields
  if (!title) {
    return error(res, 'Notification title is required', 400);
  }

  if (!message) {
    return error(res, 'Notification message is required', 400);
  }

  // Validate notification type if provided
  if (type && !['info', 'warning', 'alert', 'reminder'].includes(type)) {
    return error(res, 'Invalid notification type', 400);
  }

  // Validate recipients if not a global notification
  if (!req.body.global && (!req.body.recipients || !req.body.recipients.length)) {
    return error(res, 'Recipients are required for non-global notifications', 400);
  }

  // Validate expiration date if provided
  if (req.body.expiresAt) {
    try {
      const expiresAt = new Date(req.body.expiresAt);
      const now = new Date();
      if (expiresAt <= now) {
        return error(res, 'Expiration date must be in the future', 400);
      }
    } catch (err) {
      return error(res, 'Invalid expiration date format', 400);
    }
  }

  next();
};

/**
 * Validate parent data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateParent = (req, res, next) => {
  const { name, email, phone } = req.body;

  // Check required fields
  if (!name) {
    return error(res, 'Parent name is required', 400);
  }

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return error(res, 'Invalid email format', 400);
  }

  // Validate phone if provided
  if (phone) {
    // Simple phone validation - can be enhanced based on requirements
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      return error(res, 'Invalid phone number format', 400);
    }
  }

  next();
};

/**
 * Validate student data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateStudent = (req, res, next) => {
  const { name, email, password, rollNumber } = req.body;

  // Check required fields
  if (!name) {
    return error(res, 'Student name is required', 400);
  }

  if (!email) {
    return error(res, 'Email is required', 400);
  }

  if (!req.params.id && !password) {
    return error(res, 'Password is required for new students', 400);
  }

  if (!rollNumber) {
    return error(res, 'Roll number is required', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return error(res, 'Invalid email format', 400);
  }

  // Validate password strength if provided
  if (password && password.length < 6) {
    return error(res, 'Password must be at least 6 characters long', 400);
  }

  // Validate phone if provided
  if (req.body.phone) {
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(req.body.phone.replace(/[^0-9]/g, ''))) {
      return error(res, 'Invalid phone number format', 400);
    }
  }

  // Validate date of birth if provided
  if (req.body.dateOfBirth) {
    try {
      const dob = new Date(req.body.dateOfBirth);
      const now = new Date();
      if (dob > now) {
        return error(res, 'Date of birth cannot be in the future', 400);
      }
    } catch (err) {
      return error(res, 'Invalid date of birth format', 400);
    }
  }

  next();
};

/**
 * Validate circular data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateCircular = (req, res, next) => {
  const { title, content, targetAudience } = req.body;

  // Check required fields
  if (!title) {
    return error(res, 'Circular title is required', 400);
  }

  if (!content) {
    return error(res, 'Circular content is required', 400);
  }

  // Validate target audience if provided
  if (targetAudience && !['all', 'teachers', 'parents'].includes(targetAudience)) {
    return error(res, 'Invalid target audience. Must be "all", "teachers", or "parents"', 400);
  }

  next();
};
