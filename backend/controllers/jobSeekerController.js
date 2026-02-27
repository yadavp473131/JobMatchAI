const JobSeekerProfile = require('../models/JobSeekerProfile');
const cache = require('../services/cacheService');

/**
 * Create or update profile from parsed resume data
 * @route POST /api/jobseekers/profile/from-resume
 * @access Private (Job Seekers only)
 */
const createProfileFromResume = async (req, res) => {
  try {
    const { personalInfo, skills, experience, education } = req.body;

    // Check if profile exists
    let profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    const profileData = {
      userId: req.user._id,
    };

    // Map personal info
    if (personalInfo) {
      if (personalInfo.fullName) {
        const nameParts = personalInfo.fullName.split(' ');
        profileData.firstName = nameParts[0];
        profileData.lastName = nameParts.slice(1).join(' ') || nameParts[0];
      }
      if (personalInfo.phone) profileData.phone = personalInfo.phone;
      if (personalInfo.location) profileData.location = personalInfo.location;
    }

    // Map skills
    if (skills && Array.isArray(skills)) {
      profileData.skills = skills.filter((skill) => skill && skill.trim());
    }

    // Map experience
    if (experience && Array.isArray(experience)) {
      profileData.experience = experience.map((exp) => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate === 'Present' ? undefined : exp.endDate,
        current: exp.endDate === 'Present',
        description: exp.description,
      }));
    }

    // Map education
    if (education && Array.isArray(education)) {
      profileData.education = education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        field: edu.field || '',
        startDate: edu.startDate,
        endDate: edu.endDate === 'Present' ? undefined : edu.endDate,
        current: edu.endDate === 'Present',
      }));
    }

    if (profile) {
      // Update existing profile
      Object.keys(profileData).forEach((key) => {
        if (key !== 'userId') {
          profile[key] = profileData[key];
        }
      });
      await profile.save();

      // Invalidate recommendation cache for this user
      cache.invalidatePattern(`recommendations:jobs:${req.user._id}:*`);

      res.status(200).json({
        success: true,
        message: 'Profile updated from resume data',
        data: {
          profile,
        },
      });
    } else {
      // Create new profile
      profile = await JobSeekerProfile.create(profileData);

      res.status(201).json({
        success: true,
        message: 'Profile created from resume data',
        data: {
          profile,
        },
      });
    }
  } catch (error) {
    console.error('Create profile from resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create profile from resume',
      error: error.message,
    });
  }
};

/**
 * Create job seeker profile
 * @route POST /api/jobseekers/profile
 * @access Private (Job Seekers only)
 */
const createProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists. Use PUT to update.',
      });
    }

    // Create profile
    const profile = await JobSeekerProfile.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create profile',
      error: error.message,
    });
  }
};

/**
 * Get job seeker profile
 * @route GET /api/jobseekers/profile
 * @access Private (Job Seekers only)
 */
const getProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id }).populate(
      'userId',
      'email'
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
};

/**
 * Update job seeker profile
 * @route PUT /api/jobseekers/profile
 * @access Private (Job Seekers only)
 */
const updateProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.',
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'location',
      'skills',
      'experience',
      'education',
      'preferences',
      'profileVisibility',
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        profile[key] = req.body[key];
      }
    });

    await profile.save();

    // Invalidate recommendation cache for this user
    cache.invalidatePattern(`recommendations:jobs:${req.user._id}:*`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};

/**
 * Add skills to profile
 * @route POST /api/jobseekers/profile/skills
 * @access Private (Job Seekers only)
 */
const addSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of skills',
      });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Add new skills (avoid duplicates)
    skills.forEach((skill) => {
      const trimmedSkill = skill.trim();
      if (trimmedSkill && !profile.skills.includes(trimmedSkill)) {
        profile.skills.push(trimmedSkill);
      }
    });

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Skills added successfully',
      data: {
        skills: profile.skills,
      },
    });
  } catch (error) {
    console.error('Add skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skills',
      error: error.message,
    });
  }
};

/**
 * Remove skill from profile
 * @route DELETE /api/jobseekers/profile/skills/:skill
 * @access Private (Job Seekers only)
 */
const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Remove skill
    profile.skills = profile.skills.filter((s) => s !== skill);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      data: {
        skills: profile.skills,
      },
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove skill',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  addSkills,
  removeSkill,
};

/**
 * Add work experience
 * @route POST /api/jobseekers/profile/experience
 * @access Private (Job Seekers only)
 */
const addExperience = async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, current, description } = req.body;

    if (!title || !company || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, and start date are required',
      });
    }

    // Validate dates
    if (endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date',
      });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.experience.push({
      title,
      company,
      location,
      startDate,
      endDate: current ? undefined : endDate,
      current: current || false,
      description,
    });

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Experience added successfully',
      data: {
        experience: profile.experience,
      },
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add experience',
      error: error.message,
    });
  }
};

/**
 * Update work experience
 * @route PUT /api/jobseekers/profile/experience/:id
 * @access Private (Job Seekers only)
 */
const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const experience = profile.experience.id(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    // Update fields
    const allowedUpdates = ['title', 'company', 'location', 'startDate', 'endDate', 'current', 'description'];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        experience[key] = req.body[key];
      }
    });

    // Validate dates
    if (experience.endDate && new Date(experience.startDate) > new Date(experience.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date',
      });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: {
        experience: profile.experience,
      },
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error.message,
    });
  }
};

/**
 * Delete work experience
 * @route DELETE /api/jobseekers/profile/experience/:id
 * @access Private (Job Seekers only)
 */
const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.experience.pull(id);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
      data: {
        experience: profile.experience,
      },
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  addSkills,
  removeSkill,
  addExperience,
  updateExperience,
  deleteExperience,
};

/**
 * Add education
 * @route POST /api/jobseekers/profile/education
 * @access Private (Job Seekers only)
 */
const addEducation = async (req, res) => {
  try {
    const { degree, institution, field, startDate, endDate, current } = req.body;

    if (!degree || !institution || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Degree, institution, and start date are required',
      });
    }

    // Validate dates
    if (endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date',
      });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.education.push({
      degree,
      institution,
      field,
      startDate,
      endDate: current ? undefined : endDate,
      current: current || false,
    });

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education added successfully',
      data: {
        education: profile.education,
      },
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add education',
      error: error.message,
    });
  }
};

/**
 * Update education
 * @route PUT /api/jobseekers/profile/education/:id
 * @access Private (Job Seekers only)
 */
const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const education = profile.education.id(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found',
      });
    }

    // Update fields
    const allowedUpdates = ['degree', 'institution', 'field', 'startDate', 'endDate', 'current'];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        education[key] = req.body[key];
      }
    });

    // Validate dates
    if (education.endDate && new Date(education.startDate) > new Date(education.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date',
      });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education updated successfully',
      data: {
        education: profile.education,
      },
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update education',
      error: error.message,
    });
  }
};

/**
 * Delete education
 * @route DELETE /api/jobseekers/profile/education/:id
 * @access Private (Job Seekers only)
 */
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.education.pull(id);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
      data: {
        education: profile.education,
      },
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete education',
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  addSkills,
  removeSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  createProfileFromResume,
};
