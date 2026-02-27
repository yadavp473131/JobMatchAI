const mongoose = require('mongoose');

const recommendationFeedbackSchema = new mongoose.Schema(
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
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    rating: {
      type: String,
      enum: ['helpful', 'not_helpful', 'irrelevant'],
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate feedback
recommendationFeedbackSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const RecommendationFeedback = mongoose.model(
  'RecommendationFeedback',
  recommendationFeedbackSchema
);

module.exports = RecommendationFeedback;
