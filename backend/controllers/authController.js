const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and role',
      });
    }

    // Validate role
    if (!['jobseeker', 'employer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either jobseeker or employer',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      role,
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        isVerified: false,
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message,
    });
  }
};

/**
 * Verify email with token
 * @route POST /api/auth/verify-email
 * @access Public
 */
const verifyEmail = async (req, res) => {
  
  try {
    // Accept token from either query params (GET) or body (POST)
    const token = req.query.token || req.body.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Hash the token to compare with database
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message,
    });
  }
};

/**
 * Resend verification email
 * @route POST /api/auth/resend-verification
 * @access Public
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
};

/**
 * Forgot password - Send reset email
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
      });
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message,
    });
  }
};

/**
 * Reset password with token
 * @route POST /api/auth/reset-password
 * @access Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the token to compare with database
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
