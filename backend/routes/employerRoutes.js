const express = require('express');
const { createProfile, getProfile, updateProfile } = require('../controllers/employerController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

// Create profile
router.post('/profile', authenticate, authorize('employer'), createProfile);

// Get profile
router.get('/profile', authenticate, authorize('employer'), getProfile);

// Update profile
router.put('/profile', authenticate, authorize('employer'), updateProfile);

module.exports = router;
