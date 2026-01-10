const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseHandler');

// Use environment variable for JWT secret or fallback to a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'school_management_secret_key_dev_only';

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.protect = (req, res, next) => {
  // Get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return error(res, 'Not authorized to access this route', 401);
  }

  try {
    // Check if it's a local token (fallback for development)
    if (token.startsWith('local_')) {
      console.log('Local token detected, using fallback authentication');

      // For local tokens, we'll create a mock user based on the stored user data
      // This is only for development/fallback purposes
      const storedUser = req.headers['x-user-data'];
      if (storedUser) {
        try {
          const userData = JSON.parse(decodeURIComponent(storedUser));
          req.user = {
            id: userData.id,
            role: userData.role || userData.userType,
            email: userData.email,
            name: userData.name
          };
          console.log('Local authentication successful for user:', req.user.email);
          return next();
        } catch (parseErr) {
          console.error('Error parsing user data from header:', parseErr);
        }
      }

      // If no user data in header, reject the local token
      return error(res, 'Invalid local token - missing user data', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Set user in request
    req.user = decoded;

    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return error(res, 'Not authorized to access this route', 401);
  }
};

/**
 * Role-based authorization middleware
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // This is a placeholder for role-based authorization
    // In a real application, this would check if the user's role is in the allowed roles

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    next();
  };
};
