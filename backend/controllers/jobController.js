const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');

/**
 * Create job posting
 * @route POST /api/jobs
 * @access Private (Employers only)
 */
const createJob = async (req, res) => {
  try {
    // Check if employer has a profile
    const employerProfile = await EmployerProfile.findOne({ userId: req.user._id });

    if (!employerProfile) {
      return res.status(400).json({
        success: false,
        message: 'Please create an employer profile before posting jobs',
      });
    }

    const {
      title,
      description,
      requirements,
      responsibilities,
      skills,
      experienceLevel,
      jobType,
      location,
      salary,
      benefits,
      expiresAt,
    } = req.body;

    // Validate required fields
    if (!title || !description || !skills || skills.length === 0 || !experienceLevel || !jobType) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, skills, experience level, and job type are required',
      });
    }

    // Create job
    const job = await Job.create({
      employerId: req.user._id,
      title,
      description,
      requirements,
      responsibilities,
      skills,
      experienceLevel,
      jobType,
      location,
      salary,
      benefits,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: {
        job,
      },
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
};

/**
 * Get job listings with search, filter, sort, and pagination
 * @route GET /api/jobs
 * @access Public
 */
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      minSalary,
      maxSalary,
      jobType,
      experienceLevel,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = { status: 'active', expiresAt: { $gt: new Date() } };

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by location
    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') },
        { 'location.remote': true },
      ];
    }

    // Filter by salary
    if (minSalary) {
      query['salary.min'] = { $gte: parseInt(minSalary) };
    }
    if (maxSalary) {
      query['salary.max'] = { $lte: parseInt(maxSalary) };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    // Filter by experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query - don't populate, just get the jobs
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Fetch employer profiles to get company names
    const EmployerProfile = require('../models/EmployerProfile');
    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const jobObj = job.toObject();
        // Get employer profile using the employerId directly
        if (jobObj.employerId) {
          const employerProfile = await EmployerProfile.findOne({ userId: jobObj.employerId });
          if (employerProfile) {
            jobObj.company = employerProfile.companyName;
          }
        }
        return jobObj;
      })
    );

    // Get total count
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs: jobsWithCompany,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
};

/**
 * Get job details by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate('employerId', 'email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment view count
    await job.incrementViews();

    // Get employer profile
    const employerProfile = await EmployerProfile.findOne({ userId: job.employerId });

    res.status(200).json({
      success: true,
      data: {
        job,
        employer: employerProfile,
      },
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job details',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
};

/**
 * Update job
 * @route PUT /api/jobs/:id
 * @access Private (Employers only - must own the job)
 */
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this job',
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title',
      'description',
      'requirements',
      'responsibilities',
      'skills',
      'experienceLevel',
      'jobType',
      'location',
      'salary',
      'benefits',
      'expiresAt',
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        job[key] = req.body[key];
      }
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: {
        job,
      },
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
};

/**
 * Delete job
 * @route DELETE /api/jobs/:id
 * @access Private (Employers only - must own the job)
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this job',
      });
    }

    // Check if there are applications
    const Application = require('../models/Application');
    const applicationCount = await Application.countDocuments({ jobId: id });

    if (applicationCount > 0) {
      // Soft delete - just mark as closed
      job.status = 'closed';
      await job.save();

      return res.status(200).json({
        success: true,
        message: 'Job marked as closed (has applications)',
        data: {
          job,
        },
      });
    }

    // Hard delete if no applications
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};

/**
 * Update job status (activate/deactivate/close)
 * @route PATCH /api/jobs/:id/status
 * @access Private (Employers only - must own the job)
 */
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active, inactive, or closed)',
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this job status',
      });
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job ${status === 'active' ? 'activated' : status === 'inactive' ? 'deactivated' : 'closed'} successfully`,
      data: {
        job,
      },
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job status',
      error: error.message,
    });
  }
};

/**
 * Handle expired jobs (cron job utility)
 * This would typically be called by a scheduled task
 */
const handleExpiredJobs = async () => {
  try {
    const result = await Job.updateMany(
      {
        status: 'active',
        expiresAt: { $lt: new Date() },
      },
      {
        status: 'closed',
      }
    );

    console.log(`Closed ${result.modifiedCount} expired jobs`);
    return result;
  } catch (error) {
    console.error('Handle expired jobs error:', error);
    throw error;
  }
};

/**
 * Get employer's own jobs
 * @route GET /api/jobs/my-jobs
 * @access Private (Employers only)
 */
const getMyJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query for employer's jobs
    const query = { employerId: req.user._id };

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get employer's jobs
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get employer profile for company name
    const employerProfile = await EmployerProfile.findOne({ userId: req.user._id });

    // Add company name to jobs
    const jobsWithCompany = jobs.map(job => {
      const jobObj = job.toObject();
      if (employerProfile) {
        jobObj.company = employerProfile.companyName;
      }
      return jobObj;
    });

    // Get total count
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs: jobsWithCompany,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  handleExpiredJobs,
  getMyJobs,
};
