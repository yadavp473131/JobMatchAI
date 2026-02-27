const express = require('express');
const router = express.Router();
const {
  getJobSeekerDashboard,
  getEmployerDashboard,
  getAdminAnalytics,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// @route   GET /api/dashboard/jobseeker
// @desc    Get job seeker dashboard data
// @access  Private (Job Seekers only)
router.get('/jobseeker', protect, authorize('jobseeker'), getJobSeekerDashboard);

// @route   GET /api/dashboard/employer
// @desc    Get employer dashboard data
// @access  Private (Employers only)
router.get('/employer', protect, authorize('employer'), getEmployerDashboard);

// @route   GET /api/dashboard/admin
// @desc    Get admin analytics data
// @access  Private (Admin only)
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
