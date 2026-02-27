const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer', 'admin'],
      required: [true, 'User role is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to generate verification token
userSchema.methods.generateVerificationToken = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Method to generate password reset token
userSchema.methods.generateResetToken = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
