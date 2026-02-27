const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const User = require('../models/User');
const { calculateMatchScore } = require('../services/matchingService');
const mongoose = require('mongoose');

/**
 * Get job seeker dashboard data
 * @route GET /api/dashboard/jobseeker
 * @access Private (Job Seekers only)
 */
const getJobSeekerDashboard = async (req, res) => {
  try {
    // Get job seeker profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.',
      });
    }

    // Get application statistics
    const totalApplications = await Application.countDocuments({
      jobSeekerId: req.user._id,
    });

    const applicationsByStatus = await Application.aggregate([
      { $match: { jobSeekerId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      pending: 0,
      reviewing: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };

    applicationsByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    // Get recent applications (last 5)
    const recentApplications = await Application.find({
      jobSeekerId: req.user._id,
    })
      .populate('jobId', 'title location salaryMin salaryMax')
      .sort({ appliedAt: -1 })
      .limit(5);

    // Get job recommendations (top 5)
    const activeJobs = await Job.find({ status: 'active' })
      .populate('employerId', 'companyName companyLogo')
      .limit(20)
      .lean();

    const jobsWithScores = activeJobs.map((job) => {
      const matchResult = calculateMatchScore(profile, job);
      return {
        job,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
      };
    });

    const topRecommendations = jobsWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    // Calculate response rate
    const respondedApplications =
      statusCounts.reviewing +
      statusCounts.shortlisted +
      statusCounts.rejected +
      statusCounts.hired;
    const responseRate =
      totalApplications > 0
        ? Math.round((respondedApplications / totalApplications) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        profile: {
          completeness: profile.profileCompleteness,
          skills: profile.skills.length,
          experience: profile.experience.length,
          education: profile.education.length,
        },
        statistics: {
          totalApplications,
          statusCounts,
          responseRate,
        },
        recentApplications,
        topRecommendations,
      },
    });
  } catch (error) {
    console.error('Get job seeker dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message,
    });
  }
};

/**
 * Get employer dashboard data
 * @route GET /api/dashboard/employer
 * @access Private (Employers only)
 */
const getEmployerDashboard = async (req, res) => {
  try {
    // Get employer profile
    const profile = await EmployerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.',
      });
    }

    // Convert user ID to ObjectId for proper comparison
    const employerObjectId = new mongoose.Types.ObjectId(req.user._id.toString());

    // Get job posting statistics
    const totalJobs = await Job.countDocuments({ employerId: employerObjectId });

    const jobsByStatus = await Job.aggregate([
      { $match: { employerId: employerObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const jobStatusCounts = {
      active: 0,
      inactive: 0,
      closed: 0,
    };

    jobsByStatus.forEach((item) => {
      jobStatusCounts[item._id] = item.count;
    });

    // Get total applicants across all jobs
    const applicantStats = await Job.aggregate([
      { $match: { employerId: employerObjectId } },
      {
        $group: {
          _id: null,
          totalApplicants: { $sum: '$applicantCount' },
          totalViews: { $sum: '$viewCount' },
        },
      },
    ]);

    const totalApplicants = applicantStats[0]?.totalApplicants || 0;
    const totalViews = applicantStats[0]?.totalViews || 0;

    // Get application metrics
    const employerJobs = await Job.find({ employerId: employerObjectId }).select('_id');
    const jobIds = employerJobs.map((job) => job._id);

    const applicationsByStatus = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const applicationStatusCounts = {
      pending: 0,
      reviewing: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };

    applicationsByStatus.forEach((item) => {
      applicationStatusCounts[item._id] = item.count;
    });

    // Get recent applications (last 5)
    const recentApplications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate('jobId', 'title')
      .populate('jobSeekerId', 'email')
      .sort({ appliedAt: -1 })
      .limit(5);

    // Get applications with job seeker profiles
    const recentApplicationsWithProfiles = await Promise.all(
      recentApplications.map(async (app) => {
        const profile = await JobSeekerProfile.findOne({
          userId: app.jobSeekerId,
        });
        return {
          ...app.toObject(),
          profile: profile
            ? {
                firstName: profile.firstName,
                lastName: profile.lastName,
                skills: profile.skills,
              }
            : null,
        };
      })
    );

    // Get top performing jobs (by applicant count)
    const topJobs = await Job.find({ employerId: employerObjectId })
      .sort({ applicantCount: -1 })
      .limit(5)
      .select('title applicantCount viewCount status');

    res.status(200).json({
      success: true,
      data: {
        profile: {
          companyName: profile.companyName,
          location: profile.location,
        },
        statistics: {
          totalJobs,
          jobStatusCounts,
          totalApplicants,
          totalViews,
          applicationStatusCounts,
        },
        recentApplications: recentApplicationsWithProfiles,
        topJobs,
      },
    });
  } catch (error) {
    console.error('Get employer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message,
    });
  }
};

/**
 * Get admin analytics data
 * @route GET /api/dashboard/admin
 * @access Private (Admin only)
 */
const getAdminAnalytics = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const roleCounts = {
      jobseeker: 0,
      employer: 0,
      admin: 0,
    };

    usersByRole.forEach((item) => {
      roleCounts[item._id] = item.count;
    });

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get job statistics
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });

    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get job posting trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentJobs = await Job.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get application statistics
    const totalApplications = await Application.countDocuments();

    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const applicationStatusCounts = {
      pending: 0,
      reviewing: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };

    applicationsByStatus.forEach((item) => {
      applicationStatusCounts[item._id] = item.count;
    });

    // Get application trends (last 7 days)
    const recentApplications = await Application.countDocuments({
      appliedAt: { $gte: sevenDaysAgo },
    });

    // Calculate platform metrics
    const avgApplicationsPerJob = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(2) : 0;

    const hiredCount = applicationStatusCounts.hired;
    const hireRate = totalApplications > 0 ? ((hiredCount / totalApplications) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: roleCounts,
          newUsersLast30Days: newUsers,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          byType: jobsByType,
          newJobsLast7Days: recentJobs,
        },
        applications: {
          total: totalApplications,
          byStatus: applicationStatusCounts,
          newApplicationsLast7Days: recentApplications,
        },
        metrics: {
          avgApplicationsPerJob: parseFloat(avgApplicationsPerJob),
          hireRate: parseFloat(hireRate),
        },
      },
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
      error: error.message,
    });
  }
};

module.exports = {
  getJobSeekerDashboard,
  getEmployerDashboard,
  getAdminAnalytics,
};
