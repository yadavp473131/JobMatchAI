const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['application_status', 'new_match', 'new_applicant', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  await this.save();
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany({ userId, isRead: false }, { isRead: true });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
