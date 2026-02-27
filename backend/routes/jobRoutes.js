const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyJobs,
} = require('../controllers/jobController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (Public with optional auth)
router.get('/', optionalAuth, getJobs);

// Get employer's own jobs (Employers only) - MUST be before /:id route
router.get('/my-jobs', authenticate, authorize('employer'), getMyJobs);

// Create job (Employers only)
router.post('/', authenticate, authorize('employer'), createJob);

// Get job by ID (Public)
router.get('/:id', optionalAuth, getJobById);

// Update job (Employers only - ownership verified in controller)
router.put('/:id', authenticate, authorize('employer'), updateJob);

// Delete job (Employers only - ownership verified in controller)
router.delete('/:id', authenticate, authorize('employer'), deleteJob);

// Update job status (Employers only - ownership verified in controller)
router.patch('/:id/status', authenticate, authorize('employer'), updateJobStatus);

module.exports = router;
