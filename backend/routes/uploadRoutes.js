const express = require('express');
const {
  uploadResume,
  uploadLogo,
  deleteResume,
  deleteLogo,
  serveFile,
} = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { uploadResume: multerResume, uploadLogo: multerLogo } = require('../config/multer');

const router = express.Router();

// Upload resume (Job Seekers only)
router.post(
  '/resume',
  authenticate,
  authorize('jobseeker'),
  multerResume.single('resume'),
  uploadResume
);

// Delete resume (Job Seekers only)
router.delete('/resume', authenticate, authorize('jobseeker'), deleteResume);

// Upload company logo (Employers only)
router.post('/logo', authenticate, authorize('employer'), multerLogo.single('logo'), uploadLogo);

// Delete company logo (Employers only)
router.delete('/logo', authenticate, authorize('employer'), deleteLogo);

// Serve file (authenticated users)
router.get('/file/:filename', authenticate, serveFile);

module.exports = router;
