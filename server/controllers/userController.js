const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const { success, error } = require('../utils/responseHandler');

// JWT for authentication
const jwt = require('jsonwebtoken');
// Use environment variable for JWT secret or fallback to a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'school_management_secret_key_dev_only';

/**
 * Register a new user
 * @route POST /api/user/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    if (!name || !email || !password || !phone) {
      return error(res, 'Please provide all required fields', 400);
    }

    if (!userType || !['admin', 'teacher', 'student', 'parent'].includes(userType)) {
      return error(res, 'Please provide a valid user type', 400);
    }

    // Validate password strength
    if (password.length < 6) {
      return error(res, 'Password must be at least 6 characters long', 400);
    }

    // Check if user with this email already exists
    let existingUser;
    let Model;

    switch (userType) {
      case 'admin':
        existingUser = await Admin.findOne({ email });
        Model = Admin;
        break;
      case 'teacher':
        existingUser = await Teacher.findOne({ email });
        Model = Teacher;
        break;
      case 'student':
        existingUser = await Student.findOne({ email });
        Model = Student;
        break;
      case 'parent':
        existingUser = await Parent.findOne({ email });
        Model = Parent;
        break;
    }

    if (existingUser) {
      return error(res, `${userType.charAt(0).toUpperCase() + userType.slice(1)} with this email already exists`, 400);
    }

    // Create new user
    const userData = {
      name,
      email,
      password, // In a real app, hash this password
      phone
    };

    // Add default profileUrl for admin users
    if (userType === 'admin') {
      userData.profileUrl = null; // Explicitly set profileUrl to null for admins
    }

    const newUser = new Model(userData);

    await newUser.save();

    return success(res, null, 'Registration successful', 201);
  } catch (err) {
    return error(res, 'Registration failed', 500, err.message);
  }
};

/**
 * Login user
 * @route POST /api/user/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password) {
      return error(res, 'Please provide email and password', 400);
    }

    if (!userType || !['admin', 'teacher', 'student', 'parent'].includes(userType)) {
      return error(res, 'Please provide a valid user type', 400);
    }

    // Find user based on user type
    let user;
    switch (userType) {
      case 'admin':
        user = await Admin.findOne({ email });
        break;
      case 'teacher':
        user = await Teacher.findOne({ email });
        break;
      case 'student':
        user = await Student.findOne({ email });
        break;
      case 'parent':
        user = await Parent.findOne({ email });
        break;
    }

    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // In a real application, you would use bcrypt to compare passwords
    // For simplicity, we're doing a direct comparison here
    if (user.password !== password) {
      return error(res, 'Invalid credentials', 401);
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: userType },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userType,
        ...userResponse
      }
    }, 'Login successful');
  } catch (err) {
    return error(res, 'Login failed', 500, err.message);
  }
};

/**
 * Get current user profile
 * @route GET /api/user/me
 * @access Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;
    switch (role) {
      case 'admin':
        user = await Admin.findById(id).select('-password');
        break;
      case 'teacher':
        user = await Teacher.findById(id)
          .select('-password')
          .populate('classAssigned', 'name section');
        break;
      case 'student':
        user = await Student.findById(id)
          .select('-password')
          .populate('classId', 'name section')
          .populate('parentId', 'name email phone');
        break;
      case 'parent':
        user = await Parent.findById(id);
        // Get children if parent
        const children = await Student.find({ parentId: id })
          .select('-password')
          .populate('classId', 'name section');
        user = { ...user.toObject(), children };
        break;
      default:
        return error(res, 'Invalid user role', 400);
    }

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, {
      id: user._id,
      role,
      ...user
    }, 'User profile retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve user profile', 500, err.message);
  }
};

/**
 * Change password
 * @route PUT /api/user/password
 * @access Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user;

    if (!currentPassword || !newPassword) {
      return error(res, 'Please provide current and new password', 400);
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return error(res, 'Password must be at least 6 characters long', 400);
    }

    // Find user based on role
    let user;
    let Model;
    switch (role) {
      case 'admin':
        Model = Admin;
        break;
      case 'teacher':
        Model = Teacher;
        break;
      case 'student':
        Model = Student;
        break;
      case 'parent':
        Model = Parent;
        break;
      default:
        return error(res, 'Invalid user role', 400);
    }

    user = await Model.findById(id);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    // In a real application, you would use bcrypt to compare passwords
    if (user.password !== currentPassword) {
      return error(res, 'Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword; // In a real app, hash this password
    await user.save();

    return success(res, null, 'Password changed successfully');
  } catch (err) {
    return error(res, 'Failed to change password', 500, err.message);
  }
};

/**
 * Forgot password - send reset email
 * @route POST /api/user/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email) {
      return error(res, 'Please provide email', 400);
    }

    if (!userType || !['admin', 'teacher', 'student', 'parent'].includes(userType)) {
      return error(res, 'Please provide a valid user type', 400);
    }

    // Find user based on user type
    let user;
    switch (userType) {
      case 'admin':
        user = await Admin.findOne({ email });
        break;
      case 'teacher':
        user = await Teacher.findOne({ email });
        break;
      case 'student':
        user = await Student.findOne({ email });
        break;
      case 'parent':
        user = await Parent.findOne({ email });
        break;
    }

    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return success(res, null, 'If your email is registered, you will receive a password reset link');
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id, role: userType },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // In a real application, you would send an email with the reset link
    // For now, just return the token in the response
    return success(res, { resetToken }, 'Password reset link sent to your email');
  } catch (err) {
    return error(res, 'Failed to process forgot password request', 500, err.message);
  }
};

/**
 * Reset password
 * @route POST /api/user/reset-password
 * @access Public (with token)
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return error(res, 'Please provide token and new password', 400);
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return error(res, 'Password must be at least 6 characters long', 400);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return error(res, 'Invalid or expired token', 401);
    }

    const { id, role } = decoded;

    // Find user based on role
    let Model;
    switch (role) {
      case 'admin':
        Model = Admin;
        break;
      case 'teacher':
        Model = Teacher;
        break;
      case 'student':
        Model = Student;
        break;
      case 'parent':
        Model = Parent;
        break;
      default:
        return error(res, 'Invalid user role', 400);
    }

    const user = await Model.findById(id);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    // Update password
    user.password = newPassword; // In a real app, hash this password
    await user.save();

    return success(res, null, 'Password reset successful');
  } catch (err) {
    return error(res, 'Failed to reset password', 500, err.message);
  }
};

/**
 * Logout user
 * @route POST /api/user/logout
 * @access Private
 */
exports.logout = async (req, res) => {
  // In a real application with JWT, you might blacklist the token
  // For simplicity, we'll just return a success message
  return success(res, null, 'Logged out successfully');
};
