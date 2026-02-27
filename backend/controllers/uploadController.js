const path = require('path');
const fs = require('fs');
const JobSeekerProfile = require('../models/JobSeekerProfile');

/**
 * Upload resume
 * @route POST /api/upload/resume
 * @access Private (Job Seekers only)
 */
const uploadResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Get job seeker profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Delete uploaded file if profile doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Job seeker profile not found. Please create a profile first.',
      });
    }

    // Delete old resume if exists
    if (profile.resume && profile.resume.path) {
      const oldPath = path.join(__dirname, '..', profile.resume.path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update profile with new resume
    profile.resume = {
      filename: req.file.originalname,
      path: `uploads/resumes/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resume: profile.resume,
      },
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message,
    });
  }
};

/**
 * Upload company logo
 * @route POST /api/upload/logo
 * @access Private (Employers only)
 */
const uploadLogo = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const EmployerProfile = require('../models/EmployerProfile');

    // Get employer profile
    const profile = await EmployerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Delete uploaded file if profile doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found. Please create a profile first.',
      });
    }

    // Delete old logo if exists
    if (profile.companyLogo) {
      const oldPath = path.join(__dirname, '..', profile.companyLogo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update profile with new logo
    profile.companyLogo = `uploads/logos/${req.file.filename}`;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Company logo uploaded successfully',
      data: {
        logoUrl: profile.companyLogo,
      },
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  uploadLogo,
};

/**
 * Delete resume
 * @route DELETE /api/upload/resume
 * @access Private (Job Seekers only)
 */
const deleteResume = async (req, res) => {
  try {
    // Get job seeker profile
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Job seeker profile not found',
      });
    }

    if (!profile.resume || !profile.resume.path) {
      return res.status(404).json({
        success: false,
        message: 'No resume found to delete',
      });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '..', profile.resume.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove resume from profile
    profile.resume = undefined;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message,
    });
  }
};

/**
 * Delete company logo
 * @route DELETE /api/upload/logo
 * @access Private (Employers only)
 */
const deleteLogo = async (req, res) => {
  try {
    const EmployerProfile = require('../models/EmployerProfile');

    // Get employer profile
    const profile = await EmployerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found',
      });
    }

    if (!profile.companyLogo) {
      return res.status(404).json({
        success: false,
        message: 'No logo found to delete',
      });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '..', profile.companyLogo);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove logo from profile
    profile.companyLogo = undefined;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Company logo deleted successfully',
    });
  } catch (error) {
    console.error('Logo deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete logo',
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  uploadLogo,
  deleteResume,
  deleteLogo,
};

/**
 * Serve uploaded file
 * @route GET /api/upload/file/:filename
 * @access Private
 */
const serveFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query; // 'resume' or 'logo'

    if (!type || !['resume', 'logo'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'File type must be specified (resume or logo)',
      });
    }

    // Construct file path
    const folder = type === 'resume' ? 'resumes' : 'logos';
    const filePath = path.join(__dirname, '..', 'uploads', folder, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Verify file ownership for resumes
    if (type === 'resume') {
      const profile = await JobSeekerProfile.findOne({ userId: req.user._id });
      
      if (!profile || !profile.resume || !profile.resume.path.includes(filename)) {
        // Check if user is employer or admin (they can view applicant resumes)
        if (!['employer', 'admin'].includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: 'Access denied',
          });
        }
      }
    }

    // Verify file ownership for logos
    if (type === 'logo') {
      const EmployerProfile = require('../models/EmployerProfile');
      const profile = await EmployerProfile.findOne({ userId: req.user._id });
      
      if (!profile || !profile.companyLogo || !profile.companyLogo.includes(filename)) {
        // Logos can be viewed by anyone (public)
        // So we don't restrict access
      }
    }

    // Set content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file',
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  uploadLogo,
  deleteResume,
  deleteLogo,
  serveFile,
};
