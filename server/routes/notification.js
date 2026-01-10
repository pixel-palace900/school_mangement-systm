const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');
const { validateNotification } = require('../middleware/validator');

// Mark all notifications as read
router.put(
  '/read-all',
  protect,
  notificationController.markAllAsRead
);

// Mark notification as read
router.put(
  '/read/:id',
  protect,
  notificationController.markAsRead
);

// Get user notifications
router.get(
  '/user',
  protect,
  notificationController.getUserNotifications
);

// Get all notifications (admin only)
router.get(
  '/',
  protect,
  authorize('admin'),
  notificationController.getAllNotifications
);

// Get notification by ID
router.get(
  '/:id',
  protect,
  notificationController.getNotificationById
);

// Create new notification
router.post(
  '/',
  protect,
  authorize('admin', 'teacher'),
  validateNotification,
  notificationController.createNotification
);

// Update notification
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateNotification,
  notificationController.updateNotification
);

// Delete notification
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  notificationController.deleteNotification
);

module.exports = router;
