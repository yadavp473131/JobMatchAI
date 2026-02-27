const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = {
  resumes: path.join(__dirname, '../uploads/resumes'),
  logos: path.join(__dirname, '../uploads/logos'),
};

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.resumes);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

// Storage configuration for company logos
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirs.logos);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

// File filter for resumes (PDF, DOC, DOCX)
const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes'));
};

// File filter for logos (images only)
const logoFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed for logos'));
};

// Multer upload configurations
const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: resumeFileFilter,
});

const uploadLogo = multer({
  storage: logoStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: logoFileFilter,
});

module.exports = {
  uploadResume,
  uploadLogo,
  uploadDirs,
};
