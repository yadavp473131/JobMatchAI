const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  toggleBanUser,
  getAllJobs,
  deleteJob,
  updateJobStatus,
  getAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Analytics route
// @route   GET /api/admin/analytics
// @desc    Get platform analytics and statistics
// @access  Private (Admin only)
router.get('/analytics', getAnalytics);

// User management routes
// @route   GET /api/admin/users
// @desc    Get all users with filtering
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get user details
// @access  Private (Admin only)
router.get('/users/:id', getUserDetails);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', deleteUser);

// @route   PATCH /api/admin/users/:id/ban
// @desc    Ban/Unban user
// @access  Private (Admin only)
router.patch('/users/:id/ban', toggleBanUser);

// Job moderation routes
// @route   GET /api/admin/jobs
// @desc    Get all jobs for moderation
// @access  Private (Admin only)
router.get('/jobs', getAllJobs);

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete job
// @access  Private (Admin only)
router.delete('/jobs/:id', deleteJob);

// @route   PATCH /api/admin/jobs/:id/status
// @desc    Update job status
// @access  Private (Admin only)
router.patch('/jobs/:id/status', updateJobStatus);

module.exports = router;
