const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { parseResumeWithAI } = require('./openaiService');

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from DOCX file
 * @param {string} filePath - Path to DOCX file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Extract text from DOC file (legacy format)
 * Note: mammoth primarily supports DOCX, DOC support is limited
 * @param {string} filePath - Path to DOC file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromDOC = async (filePath) => {
  try {
    // Try to extract using mammoth (limited DOC support)
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOC extraction error:', error);
    throw new Error(
      'Failed to extract text from DOC file. Please convert to DOCX or PDF format.'
    );
  }
};

/**
 * Extract text from resume file based on file type
 * @param {string} filePath - Path to resume file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf':
      return await extractTextFromPDF(filePath);
    case '.docx':
      return await extractTextFromDOCX(filePath);
    case '.doc':
      return await extractTextFromDOC(filePath);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
};

/**
 * Parse resume file and extract structured data
 * @param {string} filePath - Path to resume file
 * @returns {Promise<Object>} Parsed resume data
 */
const parseResume = async (filePath) => {
  try {
    // Step 1: Extract text from file
    const resumeText = await extractTextFromResume(filePath);

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('No text could be extracted from the resume');
    }

    // Step 2: Parse text with AI
    const parsedData = await parseResumeWithAI(resumeText);

    return parsedData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromDOC,
  extractTextFromResume,
  parseResume,
};
