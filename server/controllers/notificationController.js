const Notification = require('../models/Notification');
const { success, error } = require('../utils/responseHandler');
const mongoose = require('mongoose');

/**
 * Get all notifications
 * @route GET /api/notification
 * @access Private/Admin
 */
exports.getAllNotifications = async (req, res) => {
  try {
    // Support filtering by type, date range, or global status
    const filter = {};
    
    // Filter by type if provided
    if (req.query.type && ['info', 'warning', 'alert', 'reminder'].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    
    // Filter by global status if provided
    if (req.query.global === 'true') {
      filter.global = true;
    } else if (req.query.global === 'false') {
      filter.global = false;
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.createdAt = { $lte: new Date(req.query.endDate) };
    }
    
    // Get notifications
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 });
    
    return success(res, { 
      notifications, 
      count: notifications.length 
    }, 'Notifications retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve notifications', 500, err.message);
  }
};

/**
 * Get notification by ID
 * @route GET /api/notification/:id
 * @access Private/Admin
 */
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return error(res, 'Notification not found', 404);
    }
    
    return success(res, notification, 'Notification retrieved successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to retrieve notification', 500, err.message);
  }
};

/**
 * Create new notification
 * @route POST /api/notification
 * @access Private/Admin/Teacher
 */
exports.createNotification = async (req, res) => {
  try {
    // Create notification object
    const notificationData = {
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || 'info',
      global: req.body.global || false,
      sender: {
        senderId: req.user.id,
        senderModel: req.user.role === 'admin' ? 'Admin' : 'Teacher'
      }
    };
    
    // Add recipients if not a global notification
    if (!req.body.global && req.body.recipients && req.body.recipients.length > 0) {
      notificationData.recipients = req.body.recipients;
    }
    
    // Add related entity if provided
    if (req.body.relatedTo) {
      notificationData.relatedTo = req.body.relatedTo;
    }
    
    // Add expiration date if provided
    if (req.body.expiresAt) {
      notificationData.expiresAt = new Date(req.body.expiresAt);
    }
    
    // Create and save notification
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    
    return success(res, savedNotification, 'Notification created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create notification', 500, err.message);
  }
};

/**
 * Update notification
 * @route PUT /api/notification/:id
 * @access Private/Admin
 */
exports.updateNotification = async (req, res) => {
  try {
    // Check if notification exists
    let notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return error(res, 'Notification not found', 404);
    }
    
    // Update fields
    const updateData = {};
    
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.message) updateData.message = req.body.message;
    if (req.body.type) updateData.type = req.body.type;
    if (req.body.global !== undefined) updateData.global = req.body.global;
    if (req.body.recipients) updateData.recipients = req.body.recipients;
    if (req.body.relatedTo) updateData.relatedTo = req.body.relatedTo;
    if (req.body.expiresAt) updateData.expiresAt = new Date(req.body.expiresAt);
    
    // Update notification
    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    return success(res, notification, 'Notification updated successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to update notification', 500, err.message);
  }
};

/**
 * Delete notification
 * @route DELETE /api/notification/:id
 * @access Private/Admin
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return error(res, 'Notification not found', 404);
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    return success(res, null, 'Notification deleted successfully');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to delete notification', 500, err.message);
  }
};

/**
 * Get user notifications
 * @route GET /api/notification/user
 * @access Private/All
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1); // Capitalize first letter
    
    // Find notifications for this user or global notifications
    const notifications = await Notification.find({
      $or: [
        { global: true },
        { 'recipients.recipientId': userId, 'recipients.recipientModel': userRole }
      ],
      // Only return non-expired notifications or ones without expiration
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ createdAt: -1 });
    
    return success(res, { 
      notifications, 
      count: notifications.length 
    }, 'User notifications retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve user notifications', 500, err.message);
  }
};

/**
 * Mark notification as read
 * @route PUT /api/notification/read/:id
 * @access Private/All
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1); // Capitalize first letter
    
    // Find the notification
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return error(res, 'Notification not found', 404);
    }
    
    // If it's a global notification, we need to add this user to recipients first
    if (notification.global) {
      // Check if user is already in recipients
      const recipientIndex = notification.recipients.findIndex(
        r => r.recipientId.toString() === userId && r.recipientModel === userRole
      );
      
      if (recipientIndex === -1) {
        // Add user to recipients
        notification.recipients.push({
          recipientId: userId,
          recipientModel: userRole,
          read: true,
          readAt: new Date()
        });
      } else {
        // Update existing recipient
        notification.recipients[recipientIndex].read = true;
        notification.recipients[recipientIndex].readAt = new Date();
      }
    } else {
      // For targeted notifications, find and update the recipient
      const recipientIndex = notification.recipients.findIndex(
        r => r.recipientId.toString() === userId && r.recipientModel === userRole
      );
      
      if (recipientIndex === -1) {
        return error(res, 'Notification not addressed to this user', 403);
      }
      
      notification.recipients[recipientIndex].read = true;
      notification.recipients[recipientIndex].readAt = new Date();
    }
    
    await notification.save();
    
    return success(res, notification, 'Notification marked as read');
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }
    return error(res, 'Failed to mark notification as read', 500, err.message);
  }
};

/**
 * Mark all notifications as read
 * @route PUT /api/notification/read-all
 * @access Private/All
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1); // Capitalize first letter
    
    // Find all notifications for this user
    const notifications = await Notification.find({
      $or: [
        { global: true },
        { 'recipients.recipientId': userId, 'recipients.recipientModel': userRole }
      ]
    });
    
    // Update each notification
    for (const notification of notifications) {
      if (notification.global) {
        // Check if user is already in recipients
        const recipientIndex = notification.recipients.findIndex(
          r => r.recipientId.toString() === userId && r.recipientModel === userRole
        );
        
        if (recipientIndex === -1) {
          // Add user to recipients
          notification.recipients.push({
            recipientId: userId,
            recipientModel: userRole,
            read: true,
            readAt: new Date()
          });
        } else if (!notification.recipients[recipientIndex].read) {
          // Update existing recipient if not already read
          notification.recipients[recipientIndex].read = true;
          notification.recipients[recipientIndex].readAt = new Date();
        }
      } else {
        // For targeted notifications, find and update the recipient
        const recipientIndex = notification.recipients.findIndex(
          r => r.recipientId.toString() === userId && r.recipientModel === userRole
        );
        
        if (recipientIndex !== -1 && !notification.recipients[recipientIndex].read) {
          notification.recipients[recipientIndex].read = true;
          notification.recipients[recipientIndex].readAt = new Date();
        }
      }
      
      await notification.save();
    }
    
    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    return error(res, 'Failed to mark all notifications as read', 500, err.message);
  }
};
