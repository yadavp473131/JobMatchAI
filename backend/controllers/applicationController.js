const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const Notification = require('../models/Notification');
const { calculateMatchScore } = require('../services/matchingService');
const { notifyApplicationStatusChange, notifyNewApplicant } = require('../services/notificationService');

/**
 * Apply to a job
 * @route POST /api/applications
 * @access Private (Job Seekers only)
 */
const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      });
    }

    // Check if job seeker has a profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please create a job seeker profile before applying to jobs',
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      });
    }

    if (job.isExpired()) {
      return res.status(400).json({
        success: false,
        message: 'This job has expired',
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      jobSeekerId: req.user._id,
      resume: profile.resume,
      coverLetter,
      status: 'pending',
      appliedAt: new Date(),
    });

    // Increment job applicant count
    await job.incrementApplicants();

    // Populate application data for notification
    await application.populate([
      { path: 'jobSeekerId', select: 'email' },
      { path: 'jobId', populate: { path: 'employerId', select: 'email companyName' } }
    ]);

    // Get employer profile
    const employerProfile = await EmployerProfile.findOne({ userId: job.employerId });
    const employer = {
      _id: job.employerId,
      email: application.jobId.employerId.email,
      companyName: employerProfile?.companyName || 'Company',
    };

    // Get job seeker data
    const jobSeeker = {
      _id: req.user._id,
      email: req.user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    };

    // Calculate match score
    const matchResult = calculateMatchScore(profile, job);
    application.matchScore = matchResult.score;
    await application.save();

    // Send notification to employer
    await notifyNewApplicant(
      {
        ...application.toObject(),
        jobSeekerId: jobSeeker,
        jobId: job,
        matchScore: matchResult.score,
      },
      employer
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        application,
        matchScore: matchResult.score,
      },
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

module.exports = {
  applyToJob,
};

/**
 * Get job seeker's applications
 * @route GET /api/applications/my-applications
 * @access Private (Job Seekers only)
 */
const getMyApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { jobSeekerId: req.user._id };

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get applications with job details
    const applications = await Application.find(query)
      .populate('jobId', 'title location salary jobType status employerId')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get employer profiles for company names
    const employerIds = applications
      .map(app => app.jobId?.employerId)
      .filter(Boolean);
    
    const employerProfiles = await EmployerProfile.find({ 
      userId: { $in: employerIds } 
    }).lean();
    
    const employerMap = {};
    employerProfiles.forEach(profile => {
      employerMap[profile.userId.toString()] = profile;
    });

    // Add company names to applications
    const applicationsWithCompany = applications.map(app => {
      const appObj = app.toObject();
      if (appObj.jobId && appObj.jobId.employerId) {
        const employerProfile = employerMap[appObj.jobId.employerId.toString()];
        if (employerProfile) {
          appObj.jobId.company = employerProfile.companyName;
        }
      }
      return appObj;
    });

    // Get total count
    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        applications: applicationsWithCompany,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applications',
      error: error.message,
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
};

/**
 * Get applicants for a job
 * @route GET /api/applications/job/:jobId
 * @access Private (Employers only - must own the job)
 */
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, sortBy = 'appliedAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    // Check if job exists and user owns it
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these applications',
      });
    }

    // Build query
    const query = { jobId };

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get applications with job seeker profiles
    const applications = await Application.find(query)
      .populate({
        path: 'jobSeekerId',
        select: 'email',
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get job seeker profiles for each application
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await JobSeekerProfile.findOne({ userId: app.jobSeekerId });
        return {
          ...app.toObject(),
          profile,
        };
      })
    );

    // Get total count
    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        applications: applicationsWithProfiles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get job applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applicants',
      error: error.message,
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
};

/**
 * Update application status
 * @route PATCH /api/applications/:id/status
 * @access Private (Employers only - must own the job)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || !['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, reviewing, shortlisted, rejected, or hired)',
      });
    }

    // Get application
    const application = await Application.findById(id).populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Verify job ownership
    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this application',
      });
    }

    // Validate status transition
    if (!application.canTransitionTo(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${application.status} to ${status}`,
      });
    }

    // Update status
    await application.updateStatus(status, req.user._id, notes);

    // Populate application data for notification
    await application.populate([
      { path: 'jobSeekerId', select: 'email' },
      { path: 'jobId', select: 'title employerId' }
    ]);

    // Send notification to job seeker
    await notifyApplicationStatusChange(application, status);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        application,
      },
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message,
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};

/**
 * Get application analytics
 * @route GET /api/applications/analytics
 * @access Private (Employers only)
 */
const getApplicationAnalytics = async (req, res) => {
  try {
    const { jobId } = req.query;

    // Build base query
    let matchQuery = {};

    if (jobId) {
      // Verify job ownership
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found',
        });
      }
      if (job.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view these analytics',
        });
      }
      matchQuery.jobId = job._id;
    } else {
      // Get all jobs for this employer
      const jobs = await Job.find({ employerId: req.user._id });
      matchQuery.jobId = { $in: jobs.map((j) => j._id) };
    }

    // Count applications by status
    const statusCounts = await Application.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Calculate response rate (applications that moved beyond pending)
    const totalApplications = await Application.countDocuments(matchQuery);
    const respondedApplications = await Application.countDocuments({
      ...matchQuery,
      status: { $ne: 'pending' },
    });
    const responseRate = totalApplications > 0 ? (respondedApplications / totalApplications) * 100 : 0;

    // Calculate average time to hire (from applied to hired)
    const hiredApplications = await Application.find({
      ...matchQuery,
      status: 'hired',
    });

    let avgTimeToHire = 0;
    if (hiredApplications.length > 0) {
      const totalDays = hiredApplications.reduce((sum, app) => {
        const hiredDate = app.statusHistory.find((h) => h.status === 'hired')?.changedAt || new Date();
        const days = (hiredDate - app.appliedAt) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      avgTimeToHire = totalDays / hiredApplications.length;
    }

    // Applications over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsOverTime = await Application.aggregate([
      {
        $match: {
          ...matchQuery,
          appliedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        responseRate: Math.round(responseRate * 100) / 100,
        avgTimeToHire: Math.round(avgTimeToHire * 100) / 100,
        applicationsOverTime,
      },
    });
  } catch (error) {
    console.error('Get application analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get application analytics',
      error: error.message,
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplicationAnalytics,
};
