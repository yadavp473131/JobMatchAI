const User = require('../models/User');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const Application = require('../models/Application');

/**
 * Get all users with filtering
 * @route GET /api/admin/users
 * @access Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isVerified,
      isBanned,
      search,
    } = req.query;

    // Build query
    const query = {};

    if (role) {
      query.role = role;
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    if (isBanned !== undefined) {
      query.isBanned = isBanned === 'true';
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

/**
 * Get user details
 * @route GET /api/admin/users/:id
 * @access Private (Admin only)
 */
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      '-password -resetPasswordToken -resetPasswordExpire -verificationToken'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get profile based on role
    let profile = null;
    if (user.role === 'jobseeker') {
      profile = await JobSeekerProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user details',
      error: error.message,
    });
  }
};

/**
 * Update user
 * @route PUT /api/admin/users/:id
 * @access Private (Admin only)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, isVerified } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update allowed fields
    if (email) user.email = email;
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isBanned: user.isBanned,
        },
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:id
 * @access Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users',
      });
    }

    // Delete associated profile
    if (user.role === 'jobseeker') {
      await JobSeekerProfile.deleteOne({ userId: user._id });
    } else if (user.role === 'employer') {
      await EmployerProfile.deleteOne({ userId: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

/**
 * Ban/Unban user
 * @route PATCH /api/admin/users/:id/ban
 * @access Private (Admin only)
 */
const toggleBanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent banning admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin users',
      });
    }

    user.isBanned = isBanned;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          isBanned: user.isBanned,
        },
      },
    });
  } catch (error) {
    console.error('Toggle ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user ban status',
      error: error.message,
    });
  }
};

/**
 * Get all jobs for moderation
 * @route GET /api/admin/jobs
 * @access Private (Admin only)
 */
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get jobs
    const jobs = await Job.find(query)
      .populate('employerId', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get employer profiles
    const jobsWithEmployers = await Promise.all(
      jobs.map(async (job) => {
        const employerProfile = await EmployerProfile.findOne({
          userId: job.employerId,
        });
        return {
          ...job.toObject(),
          employerProfile: employerProfile
            ? {
                companyName: employerProfile.companyName,
                location: employerProfile.location,
              }
            : null,
        };
      })
    );

    // Get total count
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs: jobsWithEmployers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
      error: error.message,
    });
  }
};

/**
 * Delete job (admin moderation)
 * @route DELETE /api/admin/jobs/:id
 * @access Private (Admin only)
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

    await job.deleteOne();

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

/**
 * Update job status (admin moderation)
 * @route PATCH /api/admin/jobs/:id/status
 * @access Private (Admin only)
 */
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or closed',
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job status updated successfully',
      data: { job },
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
 * Get analytics data for admin dashboard
 * @route GET /api/admin/analytics
 * @access Private (Admin only)
 */
const getAnalytics = async (req, res) => {
  try {
    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total users
    const totalUsers = await User.countDocuments();

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const usersByRoleObj = usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // New users this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    });

    // Active jobs (status: active)
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Jobs by status
    const jobsByStatus = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const jobsByStatusObj = jobsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // New jobs this month
    const newJobsThisMonth = await Job.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    });

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const applicationsByStatusObj = applicationsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Calculate success rate (hired / total applications * 100)
    const hiredCount = applicationsByStatusObj.hired || 0;
    const successRate = totalApplications > 0 
      ? ((hiredCount / totalApplications) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersByRole: usersByRoleObj,
        newUsersThisMonth,
        activeJobs,
        jobsByStatus: jobsByStatusObj,
        newJobsThisMonth,
        totalApplications,
        applicationsByStatus: applicationsByStatusObj,
        successRate: parseFloat(successRate),
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  toggleBanUser,
  getAllJobs,
  deleteJob,
  updateJobStatus,
  getAnalytics,
};
