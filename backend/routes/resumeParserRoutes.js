const express = require('express');
const router = express.Router();
const { parseResumeFile } = require('../controllers/resumeParserController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { uploadResume } = require('../config/multer');

// All routes require authentication and job seeker role
router.use(protect);
router.use(authorize('jobseeker'));

// @route   POST /api/resume-parser/parse
// @desc    Parse resume file and extract structured data
// @access  Private (Job Seekers only)
router.post('/parse', uploadResume.single('resume'), parseResumeFile);

module.exports = router;
