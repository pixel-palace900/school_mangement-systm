/**
 * Apply middleware to controllers
 * This file provides utility functions to apply middleware to controllers
 */

const middleware = require('./index');
const { protect } = require('./auth');

/**
 * Apply common middleware to all routes
 * @param {Object} app - Express application
 * @returns {void}
 */
exports.applyCommonMiddleware = (app) => {
  // Apply request logger
  app.use(middleware.requestLogger);
  
  // Apply CORS middleware
  app.use(middleware.cors);
  
  // Apply rate limiter
  app.use(middleware.rateLimiter());
  
  // Apply request body trimming
  app.use(middleware.trimRequestBody);
  
  // Apply parameter sanitization
  app.use(middleware.sanitizeParams);
};

/**
 * Apply controller-specific middleware to routes
 * @param {Object} router - Express router
 * @param {String} controllerType - Type of controller (admin, teacher, etc.)
 * @param {Object} options - Middleware options
 * @param {Boolean} options.requireAuth - Whether authentication is required (default: true)
 * @param {Boolean} options.validateAccess - Whether to validate access (default: true)
 * @returns {Object} Router with middleware applied
 */
exports.applyControllerMiddleware = (router, controllerType, options = {}) => {
  const { requireAuth = true, validateAccess = true } = options;
  
  // Apply authentication middleware if required
  if (requireAuth) {
    router.use(protect);
  }
  
  // Apply controller-specific access validation if required
  if (validateAccess && middleware.controllerMiddleware[controllerType]) {
    const accessValidator = Object.values(middleware.controllerMiddleware[controllerType])[0];
    if (typeof accessValidator === 'function') {
      router.use(accessValidator);
    }
  }
  
  return router;
};

/**
 * Apply route-specific middleware
 * @param {Object} router - Express router
 * @param {String} route - Route path
 * @param {String} method - HTTP method (get, post, put, delete)
 * @param {Array} middlewareFunctions - Array of middleware functions to apply
 * @param {Function} controller - Controller function
 * @returns {void}
 */
exports.applyRouteMiddleware = (router, route, method, middlewareFunctions, controller) => {
  if (!router[method]) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }
  
  router[method](route, ...middlewareFunctions, controller);
};

/**
 * Create a protected route with role-based authorization
 * @param {Object} router - Express router
 * @param {String} route - Route path
 * @param {String} method - HTTP method (get, post, put, delete)
 * @param {Array} roles - Array of allowed roles
 * @param {Array} middlewareFunctions - Array of middleware functions to apply
 * @param {Function} controller - Controller function
 * @returns {void}
 */
exports.createProtectedRoute = (router, route, method, roles, middlewareFunctions, controller) => {
  const { authorize } = require('./auth');
  
  if (!router[method]) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }
  
  router[method](route, protect, authorize(...roles), ...middlewareFunctions, controller);
};

/**
 * Apply validation middleware to a route
 * @param {Object} router - Express router
 * @param {String} route - Route path
 * @param {String} method - HTTP method (get, post, put, delete)
 * @param {String} validatorType - Type of validator (admin, teacher, etc.)
 * @param {Array} middlewareFunctions - Array of additional middleware functions
 * @param {Function} controller - Controller function
 * @returns {void}
 */
exports.applyValidationMiddleware = (router, route, method, validatorType, middlewareFunctions, controller) => {
  const { validator } = middleware;
  
  if (!router[method]) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }
  
  if (!validator[`validate${validatorType.charAt(0).toUpperCase() + validatorType.slice(1)}`]) {
    throw new Error(`Validator not found for type: ${validatorType}`);
  }
  
  const validatorFunction = validator[`validate${validatorType.charAt(0).toUpperCase() + validatorType.slice(1)}`];
  
  router[method](route, protect, validatorFunction, ...middlewareFunctions, controller);
};
