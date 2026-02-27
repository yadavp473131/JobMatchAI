const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplicationAnalytics,
} = require('../controllers/applicationController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

// Apply to job (Job Seekers only)
router.post('/', authenticate, authorize('jobseeker'), applyToJob);

// Get my applications (Job Seekers only)
router.get('/my-applications', authenticate, authorize('jobseeker'), getMyApplications);

// Get application analytics (Employers only)
router.get('/analytics', authenticate, authorize('employer'), getApplicationAnalytics);

// Get applicants for a job (Employers only - ownership verified in controller)
router.get('/job/:jobId', authenticate, authorize('employer'), getJobApplicants);

// Update application status (Employers only - ownership verified in controller)
router.patch('/:id/status', authenticate, authorize('employer'), updateApplicationStatus);

module.exports = router;
