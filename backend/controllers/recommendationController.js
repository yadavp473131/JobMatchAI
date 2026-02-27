const JobSeekerProfile = require('../models/JobSeekerProfile');
const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');
const RecommendationFeedback = require('../models/RecommendationFeedback');
const { calculateMatchScore } = require('../services/matchingService');
const cache = require('../services/cacheService');

/**
 * Get job recommendations for authenticated job seeker
 * @route GET /api/recommendations/jobs
 * @access Private (Job Seekers only)
 */
const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const limit = parseInt(req.query.limit) || 10;
    const minScore = parseInt(req.query.minScore) || 0;

    // Create cache key
    const cacheKey = `recommendations:jobs:${userId}:${limit}:${minScore}`;

    // Check cache first
    const cachedRecommendations = cache.get(cacheKey);
    if (cachedRecommendations) {
      return res.status(200).json({
        success: true,
        data: cachedRecommendations,
        cached: true,
      });
    }

    // Get job seeker profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.',
      });
    }

    // Fetch all active jobs (don't populate yet)
    const jobs = await Job.find({ status: 'active' }).lean();

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          recommendations: [],
          message: 'No active jobs available at the moment',
        },
      });
    }

    // Get employer profiles for company names
    const employerIds = jobs.map(job => job.employerId).filter(Boolean);
    const employerProfiles = await EmployerProfile.find({ userId: { $in: employerIds } }).lean();
    const employerMap = {};
    employerProfiles.forEach(profile => {
      employerMap[profile.userId.toString()] = profile;
    });

    // Add company names to jobs
    const jobsWithCompany = jobs.map(job => {
      const employerProfile = employerMap[job.employerId?.toString()];
      return {
        ...job,
        company: employerProfile?.companyName || 'Company',
      };
    });

    // Calculate match scores for all jobs
    const jobsWithScores = jobsWithCompany.map((job) => {
      const matchResult = calculateMatchScore(profile, job);

      return {
        job,
        matchScore: matchResult.score,
        matchBreakdown: matchResult.breakdown,
        matchReasons: matchResult.reasons,
      };
    });

    // Filter by minimum score and sort by match score (descending)
    const recommendations = jobsWithScores
      .filter((item) => item.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    const responseData = {
      recommendations,
      total: recommendations.length,
      profileCompleteness: profile.profileCompleteness,
    };

    // Cache the results for 30 minutes
    cache.set(cacheKey, responseData, 1800);

    res.status(200).json({
      success: true,
      data: responseData,
      cached: false,
    });
  } catch (error) {
    console.error('Get job recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job recommendations',
      error: error.message,
    });
  }
};

/**
 * Get candidate recommendations for a specific job
 * @route GET /api/recommendations/candidates/:jobId
 * @access Private (Employers only)
 */
const getCandidateRecommendations = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get job details
    const job = await Job.findById(jobId).populate('employerId');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify employer owns this job
    if (job.employerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view candidates for this job',
      });
    }

    // Get query parameters
    const limit = parseInt(req.query.limit) || 10;
    const minScore = parseInt(req.query.minScore) || 0;

    // Fetch all job seeker profiles with visibility set to public
    const profiles = await JobSeekerProfile.find({
      profileVisibility: { $ne: 'private' },
    })
      .populate('userId', 'email')
      .lean();

    if (profiles.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          recommendations: [],
          message: 'No candidate profiles available',
        },
      });
    }

    // Calculate match scores for all candidates
    const candidatesWithScores = profiles.map((profile) => {
      const matchResult = calculateMatchScore(profile, job);

      return {
        candidate: {
          _id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          location: profile.location,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          profileCompleteness: profile.profileCompleteness,
        },
        matchScore: matchResult.score,
        matchBreakdown: matchResult.breakdown,
        matchReasons: matchResult.reasons,
      };
    });

    // Filter by minimum score and sort by match score (descending)
    const recommendations = candidatesWithScores
      .filter((item) => item.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: {
        job: {
          _id: job._id,
          title: job.title,
          company: job.employerId.companyName,
        },
        recommendations,
        total: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Get candidate recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get candidate recommendations',
      error: error.message,
    });
  }
};

module.exports = {
  getJobRecommendations,
  getCandidateRecommendations,
};

/**
 * Submit feedback for a job recommendation
 * @route POST /api/recommendations/feedback
 * @access Private (Job Seekers only)
 */
const submitRecommendationFeedback = async (req, res) => {
  try {
    const { jobId, matchScore, rating, comment } = req.body;

    // Validate required fields
    if (!jobId || !matchScore || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Job ID, match score, and rating are required',
      });
    }

    // Validate rating
    if (!['helpful', 'not_helpful', 'irrelevant'].includes(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be helpful, not_helpful, or irrelevant',
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if feedback already exists
    let feedback = await RecommendationFeedback.findOne({
      userId: req.user._id,
      jobId,
    });

    if (feedback) {
      // Update existing feedback
      feedback.matchScore = matchScore;
      feedback.rating = rating;
      if (comment) feedback.comment = comment;
      await feedback.save();

      return res.status(200).json({
        success: true,
        message: 'Feedback updated successfully',
        data: { feedback },
      });
    }

    // Create new feedback
    feedback = await RecommendationFeedback.create({
      userId: req.user._id,
      jobId,
      matchScore,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { feedback },
    });
  } catch (error) {
    console.error('Submit recommendation feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

/**
 * Get recommendation feedback statistics
 * @route GET /api/recommendations/feedback/stats
 * @access Private (Admin only)
 */
const getRecommendationFeedbackStats = async (req, res) => {
  try {
    // Get overall feedback statistics
    const totalFeedback = await RecommendationFeedback.countDocuments();

    const feedbackByRating = await RecommendationFeedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate average match score by rating
    const avgScoreByRating = await RecommendationFeedback.aggregate([
      {
        $group: {
          _id: '$rating',
          avgMatchScore: { $avg: '$matchScore' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get most helpful recommendations (jobs with highest helpful ratings)
    const topRecommendations = await RecommendationFeedback.aggregate([
      {
        $match: { rating: 'helpful' },
      },
      {
        $group: {
          _id: '$jobId',
          helpfulCount: { $sum: 1 },
          avgMatchScore: { $avg: '$matchScore' },
        },
      },
      {
        $sort: { helpfulCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job',
        },
      },
      {
        $unwind: '$job',
      },
      {
        $project: {
          jobId: '$_id',
          jobTitle: '$job.title',
          helpfulCount: 1,
          avgMatchScore: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFeedback,
        feedbackByRating,
        avgScoreByRating,
        topRecommendations,
      },
    });
  } catch (error) {
    console.error('Get recommendation feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedback statistics',
      error: error.message,
    });
  }
};

/**
 * Search candidates with filters
 * @route GET /api/recommendations/candidates/search
 * @access Private (Employers only)
 */
const searchCandidates = async (req, res) => {
  try {
    const {
      skills,
      experienceLevel,
      location,
      minExperience,
      maxExperience,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    const query = {
      profileVisibility: { $ne: 'private' },
    };

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Calculate total years of experience filter
    // This is complex, so we'll filter after fetching

    // Fetch candidates
    let candidates = await JobSeekerProfile.find(query)
      .populate('userId', 'email')
      .lean();

    // Filter by experience years if specified
    if (minExperience || maxExperience) {
      candidates = candidates.filter((profile) => {
        let totalYears = 0;
        if (profile.experience && profile.experience.length > 0) {
          profile.experience.forEach((exp) => {
            const startDate = new Date(exp.startDate);
            const endDate = exp.current ? new Date() : new Date(exp.endDate);
            const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
            totalYears += years;
          });
        }

        if (minExperience && totalYears < parseFloat(minExperience)) return false;
        if (maxExperience && totalYears > parseFloat(maxExperience)) return false;
        return true;
      });
    }

    // If jobId is provided, calculate match scores
    const { jobId } = req.query;
    let candidatesWithScores = candidates;

    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        candidatesWithScores = candidates.map((profile) => {
          const matchResult = calculateMatchScore(profile, job);
          return {
            candidate: {
              _id: profile._id,
              firstName: profile.firstName,
              lastName: profile.lastName,
              location: profile.location,
              skills: profile.skills,
              experience: profile.experience,
              education: profile.education,
              profileCompleteness: profile.profileCompleteness,
            },
            matchScore: matchResult.score,
            matchBreakdown: matchResult.breakdown,
            matchReasons: matchResult.reasons,
          };
        });

        // Sort by match score
        candidatesWithScores.sort((a, b) => b.matchScore - a.matchScore);
      }
    } else {
      // No job specified, just return candidates
      candidatesWithScores = candidates.map((profile) => ({
        candidate: {
          _id: profile._id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          location: profile.location,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          profileCompleteness: profile.profileCompleteness,
        },
      }));
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedResults = candidatesWithScores.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        candidates: paginatedResults,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: candidatesWithScores.length,
          pages: Math.ceil(candidatesWithScores.length / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Search candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search candidates',
      error: error.message,
    });
  }
};

module.exports = {
  getJobRecommendations,
  getCandidateRecommendations,
  submitRecommendationFeedback,
  getRecommendationFeedbackStats,
  searchCandidates,
};
