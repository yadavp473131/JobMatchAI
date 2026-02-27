const express = require('express');
const {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', authenticate, getMe);

// Verify email
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);

// Resend verification email
router.post('/resend-verification', resendVerification);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
