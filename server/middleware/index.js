/**
 * Middleware index file
 * This file exports all middleware functions used in the application
 */

const { error } = require('../utils/responseHandler');

/**
 * Request logger middleware
 * Logs details about incoming requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

/**
 * Rate limiter middleware
 * Limits the number of requests from a single IP
 * @param {Object} options - Rate limiter options
 * @param {Number} options.windowMs - Time window in milliseconds
 * @param {Number} options.maxRequests - Maximum number of requests allowed in the time window
 * @returns {Function} Middleware function
 */
exports.rateLimiter = (options = { windowMs: 15 * 60 * 1000, maxRequests: 100 }) => {
  const { windowMs, maxRequests } = options;
  const requestCounts = new Map();
  
  // Clean up old entries every windowMs
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
      if (now - data.startTime > windowMs) {
        requestCounts.delete(ip);
      }
    }
  }, windowMs);
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, {
        count: 1,
        startTime: now
      });
      return next();
    }
    
    const data = requestCounts.get(ip);
    
    // Reset if window has passed
    if (now - data.startTime > windowMs) {
      data.count = 1;
      data.startTime = now;
      return next();
    }
    
    // Increment count
    data.count++;
    
    // Check if limit exceeded
    if (data.count > maxRequests) {
      return error(res, 'Too many requests, please try again later', 429);
    }
    
    next();
  };
};

/**
 * CORS middleware
 * Handles Cross-Origin Resource Sharing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};

/**
 * Trim request body values
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.trimRequestBody = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

/**
 * Sanitize request parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.sanitizeParams = (req, res, next) => {
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        // Remove any potentially harmful characters
        req.query[key] = req.query[key].replace(/[<>]/g, '');
      }
    }
  }
  
  // Sanitize URL parameters
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        // Remove any potentially harmful characters
        req.params[key] = req.params[key].replace(/[<>]/g, '');
      }
    }
  }
  
  next();
};

/**
 * Controller-specific middleware
 * Contains middleware functions specific to each controller
 */
exports.controllerMiddleware = {
  // Admin controller middleware
  admin: {
    validateAdminAccess: (req, res, next) => {
      // Check if user is an admin
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      return error(res, 'Admin access required', 403);
    }
  },
  
  // Teacher controller middleware
  teacher: {
    validateTeacherAccess: (req, res, next) => {
      // Check if user is a teacher or admin
      if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
        return next();
      }
      return error(res, 'Teacher or admin access required', 403);
    }
  },
  
  // Student controller middleware
  student: {
    validateStudentAccess: (req, res, next) => {
      // Check if user is a student, parent, teacher, or admin
      if (req.user && ['student', 'parent', 'teacher', 'admin'].includes(req.user.role)) {
        return next();
      }
      return error(res, 'Unauthorized access', 403);
    }
  },
  
  // Parent controller middleware
  parent: {
    validateParentAccess: (req, res, next) => {
      // Check if user is a parent or admin
      if (req.user && (req.user.role === 'parent' || req.user.role === 'admin')) {
        return next();
      }
      return error(res, 'Parent or admin access required', 403);
    }
  },
  
  // Class controller middleware
  class: {
    validateClassAccess: (req, res, next) => {
      // All authenticated users can access class information
      next();
    }
  },
  
  // Exam controller middleware
  exam: {
    validateExamAccess: (req, res, next) => {
      // All authenticated users can access exam information
      next();
    }
  },
  
  // Fee controller middleware
  fee: {
    validateFeeAccess: (req, res, next) => {
      // Only admin, parent, and student can access fee information
      if (req.user && ['admin', 'parent', 'student'].includes(req.user.role)) {
        return next();
      }
      return error(res, 'Unauthorized access', 403);
    }
  },
  
  // Notification controller middleware
  notification: {
    validateNotificationAccess: (req, res, next) => {
      // All authenticated users can access notifications
      next();
    }
  },
  
  // Subject controller middleware
  subject: {
    validateSubjectAccess: (req, res, next) => {
      // All authenticated users can access subject information
      next();
    }
  },
  
  // Attendance controller middleware
  attendance: {
    validateAttendanceAccess: (req, res, next) => {
      // Only admin, teacher, parent, and student can access attendance information
      if (req.user && ['admin', 'teacher', 'parent', 'student'].includes(req.user.role)) {
        return next();
      }
      return error(res, 'Unauthorized access', 403);
    }
  }
};

// Export existing middleware
exports.auth = require('./auth');
exports.validator = require('./validator');
exports.errorHandler = require('./errorHandler');
