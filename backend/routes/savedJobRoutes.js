const express = require('express');
const router = express.Router();
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// All routes require authentication and job seeker role
router.use(protect);
router.use(authorize('jobseeker'));

// @route   GET /api/saved-jobs
// @desc    Get all saved jobs for the authenticated user
// @access  Private (Job Seekers only)
router.get('/', getSavedJobs);

// @route   POST /api/saved-jobs/:jobId
// @desc    Save a job
// @access  Private (Job Seekers only)
router.post('/:jobId', saveJob);

// @route   DELETE /api/saved-jobs/:jobId
// @desc    Unsave a job
// @access  Private (Job Seekers only)
router.delete('/:jobId', unsaveJob);

module.exports = router;
