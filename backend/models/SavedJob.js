const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate saves
savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
savedJobSchema.index({ userId: 1, savedAt: -1 });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

module.exports = SavedJob;
