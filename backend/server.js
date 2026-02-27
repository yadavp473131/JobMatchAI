const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatchai')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JobMatchAI API' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/jobseekers', require('./routes/jobSeekerRoutes'));
app.use('/api/employers', require('./routes/employerRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/resume-parser', require('./routes/resumeParserRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
