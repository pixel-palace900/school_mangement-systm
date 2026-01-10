const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'reminder'],
    default: 'info'
  },
  // Who should receive this notification
  recipients: [{
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipientModel'
    },
    recipientModel: {
      type: String,
      enum: ['Admin', 'Teacher', 'Student', 'Parent']
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],
  // Who created this notification
  sender: {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'senderModel'
    },
    senderModel: {
      type: String,
      enum: ['Admin', 'Teacher', 'System']
    }
  },
  // For system-wide notifications
  global: {
    type: Boolean,
    default: false
  },
  // For notifications related to specific entities
  relatedTo: {
    model: {
      type: String,
      enum: ['Exam', 'Fee', 'Attendance', 'Class', 'Circular']
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
});

// Index for faster queries
notificationSchema.index({ 'recipients.recipientId': 1, 'recipients.read': 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ global: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
