const express = require('express');
const router = express.Router();
const {
  getJobRecommendations,
  getCandidateRecommendations,
  submitRecommendationFeedback,
  getRecommendationFeedbackStats,
  searchCandidates,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// @route   GET /api/recommendations/jobs
// @desc    Get job recommendations for authenticated job seeker
// @access  Private (Job Seekers only)
router.get('/jobs', protect, authorize('jobseeker'), getJobRecommendations);

// @route   GET /api/recommendations/candidates/search
// @desc    Search candidates with filters
// @access  Private (Employers only)
router.get('/candidates/search', protect, authorize('employer'), searchCandidates);

// @route   GET /api/recommendations/candidates/:jobId
// @desc    Get candidate recommendations for a specific job
// @access  Private (Employers only)
router.get('/candidates/:jobId', protect, authorize('employer'), getCandidateRecommendations);

// @route   POST /api/recommendations/feedback
// @desc    Submit feedback for a job recommendation
// @access  Private (Job Seekers only)
router.post('/feedback', protect, authorize('jobseeker'), submitRecommendationFeedback);

// @route   GET /api/recommendations/feedback/stats
// @desc    Get recommendation feedback statistics
// @access  Private (Admin only)
router.get('/feedback/stats', protect, authorize('admin'), getRecommendationFeedbackStats);

module.exports = router;
