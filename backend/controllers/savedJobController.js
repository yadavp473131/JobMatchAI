const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');

/**
 * Save a job
 * @route POST /api/saved-jobs/:jobId
 * @access Private (Job Seekers only)
 */
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({
      userId: req.user._id,
      jobId,
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved',
      });
    }

    // Save job
    const savedJob = await SavedJob.create({
      userId: req.user._id,
      jobId,
      savedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: {
        savedJob,
      },
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save job',
      error: error.message,
    });
  }
};

/**
 * Unsave a job
 * @route DELETE /api/saved-jobs/:jobId
 * @access Private (Job Seekers only)
 */
const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find and delete saved job
    const savedJob = await SavedJob.findOneAndDelete({
      userId: req.user._id,
      jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job unsaved successfully',
    });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsave job',
      error: error.message,
    });
  }
};

/**
 * Get all saved jobs for a user
 * @route GET /api/saved-jobs
 * @access Private (Job Seekers only)
 */
const getSavedJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get saved jobs with populated job details
    const savedJobs = await SavedJob.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ savedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out saved jobs where the job has been deleted
    const activeSavedJobs = savedJobs.filter((saved) => saved.jobId !== null);

    // Get employer profiles for company names
    const employerIds = activeSavedJobs
      .map(saved => saved.jobId?.employerId)
      .filter(Boolean);
    
    const employerProfiles = await EmployerProfile.find({ 
      userId: { $in: employerIds } 
    }).lean();
    
    const employerMap = {};
    employerProfiles.forEach(profile => {
      employerMap[profile.userId.toString()] = profile;
    });

    // Add company names to saved jobs
    const savedJobsWithCompany = activeSavedJobs.map(saved => {
      const savedObj = saved.toObject();
      if (savedObj.jobId && savedObj.jobId.employerId) {
        const employerProfile = employerMap[savedObj.jobId.employerId.toString()];
        if (employerProfile) {
          savedObj.jobId.company = employerProfile.companyName;
          savedObj.jobId.companyLogo = employerProfile.companyLogo;
        }
      }
      return savedObj;
    });

    // Get total count
    const total = await SavedJob.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        savedJobs: savedJobsWithCompany,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve saved jobs',
      error: error.message,
    });
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
};
