# Middleware Documentation

This directory contains middleware functions used throughout the application. These middleware functions handle various aspects of request processing, authentication, authorization, and validation.

## Available Middleware

### Common Middleware

These middleware functions are applied to all routes:

- **requestLogger**: Logs details about incoming requests
- **rateLimiter**: Limits the number of requests from a single IP
- **cors**: Handles Cross-Origin Resource Sharing
- **trimRequestBody**: Trims whitespace from request body values
- **sanitizeParams**: Sanitizes request parameters

### Authentication Middleware

- **protect**: Verifies JWT token and sets user in request
- **authorize**: Role-based authorization middleware

### Validation Middleware

Validates request data for different entities:

- **validateAdmin**: Validates admin data
- **validateTeacher**: Validates teacher data
- **validateStudent**: Validates student data
- **validateParent**: Validates parent data
- **validateClass**: Validates class data
- **validateExam**: Validates exam data
- **validateFee**: Validates fee data
- **validateAttendance**: Validates attendance data
- **validateNotification**: Validates notification data
- **validateSubject**: Validates subject data

### Error Handling Middleware

- **notFound**: Handles 404 errors
- **errorHandler**: General error handler

### Controller-Specific Middleware

Each controller has specific middleware functions for access control:

- **admin.validateAdminAccess**: Validates admin access
- **teacher.validateTeacherAccess**: Validates teacher access
- **student.validateStudentAccess**: Validates student access
- **parent.validateParentAccess**: Validates parent access
- **class.validateClassAccess**: Validates class access
- **exam.validateExamAccess**: Validates exam access
- **fee.validateFeeAccess**: Validates fee access
- **notification.validateNotificationAccess**: Validates notification access
- **subject.validateSubjectAccess**: Validates subject access
- **attendance.validateAttendanceAccess**: Validates attendance access

## Usage

### Applying Common Middleware

To apply common middleware to all routes, use the `applyCommonMiddleware` function in your server.js file:

```javascript
const { applyCommonMiddleware } = require('./middleware/applyMiddleware');

// Apply common middleware
applyCommonMiddleware(app);
```

### Creating Protected Routes

To create a protected route with role-based authorization, use the `createProtectedRoute` function:

```javascript
const { createProtectedRoute } = require('../middleware/applyMiddleware');

// Protected route - accessible by admins and teachers
createProtectedRoute(
  router,
  '/example',
  'get',
  ['admin', 'teacher'],
  [],
  controllerFunction
);
```

### Applying Route Middleware

To apply middleware to a specific route, use the `applyRouteMiddleware` function:

```javascript
const { applyRouteMiddleware } = require('../middleware/applyMiddleware');

// Public route with middleware
applyRouteMiddleware(
  router,
  '/example',
  'post',
  [customMiddleware1, customMiddleware2],
  controllerFunction
);
```

### Applying Validation Middleware

To apply validation middleware to a route, use the `applyValidationMiddleware` function:

```javascript
const { applyValidationMiddleware } = require('../middleware/applyMiddleware');

// Route with validation
applyValidationMiddleware(
  router,
  '/example',
  'post',
  'student',
  [customMiddleware],
  controllerFunction
);
```

### Applying Controller-Specific Middleware

To apply middleware specific to a controller, use the `applyControllerMiddleware` function:

```javascript
const { applyControllerMiddleware } = require('../middleware/applyMiddleware');

// Apply middleware to router
const protectedRouter = applyControllerMiddleware(router, 'admin');
```

## Example

Here's an example of how to use the middleware in a route file:

```javascript
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {
  createProtectedRoute,
  applyValidationMiddleware
} = require('../middleware/applyMiddleware');

// Get all admins - protected route for admins only
createProtectedRoute(
  router,
  '/',
  'get',
  ['admin'],
  [],
  adminController.getAllAdmins
);

// Create new admin - protected route with validation
applyValidationMiddleware(
  router,
  '/',
  'post',
  'admin',
  [],
  adminController.createAdmin
);

module.exports = router;
```
