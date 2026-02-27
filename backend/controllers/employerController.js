const EmployerProfile = require('../models/EmployerProfile');

/**
 * Create employer profile
 * @route POST /api/employers/profile
 * @access Private (Employers only)
 */
const createProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await EmployerProfile.findOne({ userId: req.user._id });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists. Use PUT to update.',
      });
    }

    const { companyName, companyDescription, industry, companySize, website, location, contactPerson } = req.body;

    // Validate required fields
    if (!companyName || !location || !location.city || !location.country || !contactPerson || !contactPerson.name) {
      return res.status(400).json({
        success: false,
        message: 'Company name, location (city, country), and contact person name are required',
      });
    }

    // Create profile
    const profile = await EmployerProfile.create({
      userId: req.user._id,
      companyName,
      companyDescription,
      industry,
      companySize,
      website,
      location,
      contactPerson,
    });

    res.status(201).json({
      success: true,
      message: 'Employer profile created successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error('Create employer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employer profile',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
};

/**
 * Get employer profile
 * @route GET /api/employers/profile
 * @access Private (Employers only)
 */
const getProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ userId: req.user._id }).populate(
      'userId',
      'email'
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error('Get employer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get employer profile',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
};

/**
 * Update employer profile
 * @route PUT /api/employers/profile
 * @access Private (Employers only)
 */
const updateProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found. Please create a profile first.',
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'companyName',
      'companyDescription',
      'industry',
      'companySize',
      'website',
      'location',
      'contactPerson',
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        profile[key] = req.body[key];
      }
    });

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Employer profile updated successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error('Update employer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employer profile',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};
