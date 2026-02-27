const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', getUnreadCount);

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.patch('/read-all', markAllAsRead);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.patch('/:id/read', markAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', deleteNotification);

module.exports = router;
