const { parseResume } = require('../services/resumeParserService');
const path = require('path');

/**
 * Parse resume file
 * @route POST /api/resume-parser/parse
 * @access Private (Job Seekers only)
 */
const parseResumeFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded',
      });
    }

    const filePath = req.file.path;

    // Parse the resume
    const parsedData = await parseResume(filePath);

    res.status(200).json({
      success: true,
      message: 'Resume parsed successfully',
      data: parsedData.data,
    });
  } catch (error) {
    console.error('Resume parsing error:', error);

    // Handle specific error types
    if (error.message.includes('OpenAI')) {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable',
        error: error.message,
      });
    }

    if (error.message.includes('extract text')) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from resume',
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to parse resume',
      error: error.message,
    });
  }
};

module.exports = {
  parseResumeFile,
};
