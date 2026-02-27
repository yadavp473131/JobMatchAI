const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [5, 'Job title must be at least 5 characters'],
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [50, 'Job description must be at least 50 characters'],
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      required: [true, 'Experience level is required'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote'],
      required: [true, 'Job type is required'],
    },
    location: {
      city: String,
      state: String,
      country: String,
      remote: {
        type: Boolean,
        default: false,
      },
    },
    salary: {
      min: {
        type: Number,
        required: [true, 'Minimum salary is required'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum salary is required'],
      },
      currency: {
        type: String,
        default: 'USD',
      },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly',
      },
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'closed'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        // Default expiration: 30 days from now
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
jobSchema.index({ employerId: 1 });
jobSchema.index({ status: 1, expiresAt: 1 });
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ skills: 1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });

// Method to check if job is expired
jobSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Method to increment view count
jobSchema.methods.incrementViews = async function () {
  this.viewCount += 1;
  await this.save();
};

// Method to increment applicant count
jobSchema.methods.incrementApplicants = async function () {
  this.applicantCount += 1;
  await this.save();
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
