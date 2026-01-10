const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  createProtectedRoute,
  applyRouteMiddleware
} = require('../middleware/applyMiddleware');

// Public routes
applyRouteMiddleware(router, '/register', 'post', [], userController.register);
applyRouteMiddleware(router, '/login', 'post', [], userController.login);
applyRouteMiddleware(router, '/forgot-password', 'post', [], userController.forgotPassword);
applyRouteMiddleware(router, '/reset-password', 'post', [], userController.resetPassword);

// Protected routes - accessible by all authenticated users
createProtectedRoute(
  router,
  '/me',
  'get',
  ['admin', 'teacher', 'student', 'parent'],
  [],
  userController.getCurrentUser
);

createProtectedRoute(
  router,
  '/password',
  'put',
  ['admin', 'teacher', 'student', 'parent'],
  [],
  userController.changePassword
);

createProtectedRoute(
  router,
  '/logout',
  'post',
  ['admin', 'teacher', 'student', 'parent'],
  [],
  userController.logout
);

module.exports = router;
