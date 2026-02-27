const express = require('express');
const {
  createProfile,
  getProfile,
  updateProfile,
  addSkills,
  removeSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  createProfileFromResume,
} = require('../controllers/jobSeekerController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

// Create profile
router.post('/profile', authenticate, authorize('jobseeker'), createProfile);

// Create/update profile from parsed resume data
router.post('/profile/from-resume', authenticate, authorize('jobseeker'), createProfileFromResume);

// Get profile
router.get('/profile', authenticate, authorize('jobseeker'), getProfile);

// Update profile
router.put('/profile', authenticate, authorize('jobseeker'), updateProfile);

// Add skills
router.post('/profile/skills', authenticate, authorize('jobseeker'), addSkills);

// Remove skill
router.delete('/profile/skills/:skill', authenticate, authorize('jobseeker'), removeSkill);

// Add experience
router.post('/profile/experience', authenticate, authorize('jobseeker'), addExperience);

// Update experience
router.put('/profile/experience/:id', authenticate, authorize('jobseeker'), updateExperience);

// Delete experience
router.delete('/profile/experience/:id', authenticate, authorize('jobseeker'), deleteExperience);

// Add education
router.post('/profile/education', authenticate, authorize('jobseeker'), addEducation);

// Update education
router.put('/profile/education/:id', authenticate, authorize('jobseeker'), updateEducation);

// Delete education
router.delete('/profile/education/:id', authenticate, authorize('jobseeker'), deleteEducation);

module.exports = router;
