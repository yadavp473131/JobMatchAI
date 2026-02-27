const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    resume: {
      filename: String,
      path: String,
      uploadedAt: Date,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: String,
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    education: [
      {
        degree: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        field: String,
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],
    preferences: {
      jobTypes: [
        {
          type: String,
          enum: ['full-time', 'part-time', 'contract', 'remote'],
        },
      ],
      desiredSalary: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'USD',
        },
      },
      locations: [String],
      industries: [String],
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate profile completeness before saving
jobSeekerProfileSchema.pre('save', function () {
  let completeness = 0;
  const weights = {
    basicInfo: 20, // firstName, lastName, phone, location
    resume: 20,
    skills: 15,
    experience: 20,
    education: 15,
    preferences: 10,
  };

  // Basic info
  if (this.firstName && this.lastName && this.phone && this.location.city) {
    completeness += weights.basicInfo;
  }

  // Resume
  if (this.resume && this.resume.path) {
    completeness += weights.resume;
  }

  // Skills
  if (this.skills && this.skills.length >= 3) {
    completeness += weights.skills;
  }

  // Experience
  if (this.experience && this.experience.length >= 1) {
    completeness += weights.experience;
  }

  // Education
  if (this.education && this.education.length >= 1) {
    completeness += weights.education;
  }

  // Preferences
  if (
    this.preferences &&
    this.preferences.jobTypes &&
    this.preferences.jobTypes.length > 0 &&
    this.preferences.desiredSalary &&
    this.preferences.desiredSalary.min
  ) {
    completeness += weights.preferences;
  }

  this.profileCompleteness = completeness;
});

// Calculate years of experience
jobSeekerProfileSchema.methods.calculateExperienceYears = function () {
  if (!this.experience || this.experience.length === 0) {
    return 0;
  }

  let totalMonths = 0;
  this.experience.forEach((exp) => {
    const endDate = exp.current ? new Date() : exp.endDate;
    const months = (endDate - exp.startDate) / (1000 * 60 * 60 * 24 * 30);
    totalMonths += months;
  });

  return Math.round(totalMonths / 12);
};

const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);

module.exports = JobSeekerProfile;
