const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      filename: String,
      path: String,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    matchReasons: [
      {
        type: String,
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });
applicationSchema.index({ jobSeekerId: 1 });
applicationSchema.index({ jobId: 1, status: 1 });

// Add status change to history before saving
applicationSchema.pre('save', function () {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });
  }
});

// Method to validate status transition
applicationSchema.methods.canTransitionTo = function (newStatus) {
  const validTransitions = {
    pending: ['reviewing', 'rejected'],
    reviewing: ['shortlisted', 'rejected'],
    shortlisted: ['hired', 'rejected'],
    rejected: [], // Cannot transition from rejected
    hired: [], // Cannot transition from hired
  };

  return validTransitions[this.status]?.includes(newStatus) || false;
};

// Method to update status with validation
applicationSchema.methods.updateStatus = async function (newStatus, changedBy, notes) {
  if (!this.canTransitionTo(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy,
    notes,
  });

  await this.save();
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
