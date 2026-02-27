/**
 * Integration Tests for Application Endpoints
 * **Validates: Requirements 3.6**
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');

describe('Application Endpoints - Integration Tests', () => {
  let employerToken;
  let employerId;
  let jobSeekerToken;
  let jobSeekerId;
  let testJobId;
  let testApplicationId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
    }

    // Create employer
    const employerRes = await request(app).post('/api/auth/register').send({
      email: 'test-employer-app@example.com',
      password: 'Password123!',
      role: 'employer',
    });
    employerToken = employerRes.body.data.token;
    employerId = employerRes.body.data.user._id;

    await EmployerProfile.create({
      userId: employerId,
      companyName: 'Test Company',
      industry: 'Technology',
      companySize: '50-200',
      contactPerson: { name: 'Test', email: 'test@test.com', phone: '123' },
    });

    // Create job seeker
    const jobSeekerRes = await request(app).post('/api/auth/register').send({
      email: 'test-jobseeker-app@example.com',
      password: 'Password123!',
      role: 'job-seeker',
    });
    jobSeekerToken = jobSeekerRes.body.data.token;
    jobSeekerId = jobSeekerRes.body.data.user._id;

    await JobSeekerProfile.create({
      userId: jobSeekerId,
      firstName: 'Test',
      lastName: 'User',
      skills: ['JavaScript', 'React'],
      experience: [],
      education: [],
    });

    // Create test job
    const jobRes = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        title: 'Test Job for Applications',
        description: 'Test description',
        requiredSkills: ['JavaScript'],
        experienceLevel: 'mid',
        jobType: 'full-time',
        location: { city: 'Test', state: 'TS', country: 'USA' },
      });
    testJobId = jobRes.body.data._id;
  });

  afterAll(async () => {
    await User.deleteMany({ email: /test-.*-app@example\.com/ });
    await Job.deleteMany({ title: /Test Job for Applications/ });
    await Application.deleteMany({});
    await JobSeekerProfile.deleteMany({ firstName: 'Test' });
    await EmployerProfile.deleteMany({ companyName: 'Test Company' });
    await mongoose.connection.close();
  });

  describe('POST /api/applications', () => {
    test('should submit job application', async () => {
      const applicationData = {
        jobId: testJobId,
        coverLetter: 'I am very interested in this position.',
      };

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send(applicationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobId).toBe(testJobId);
      expect(response.body.data.jobSeekerId).toBe(jobSeekerId);
      expect(response.body.data.status).toBe('pending');
      
      testApplicationId = response.body.data._id;
    });

    test('should reject duplicate application', async () => {
      const applicationData = {
        jobId: testJobId,
        coverLetter: 'Duplicate application',
      };

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send(applicationData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already applied');
    });

    test('should reject application without authentication', async () => {
      const applicationData = {
        jobId: testJobId,
        coverLetter: 'Unauthorized',
      };

      const response = await request(app)
        .post('/api/applications')
        .send(applicationData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject application by employer', async () => {
      const applicationData = {
        jobId: testJobId,
        coverLetter: 'Wrong role',
      };

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(applicationData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should reject application to non-existent job', async () => {
      const fakeJobId = new mongoose.Types.ObjectId();
      const applicationData = {
        jobId: fakeJobId.toString(),
        coverLetter: 'Non-existent job',
      };

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send(applicationData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/applications', () => {
    test('should get job seeker\'s applications', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should filter applications by status', async () => {
      const response = await request(app)
        .get('/api/applications?status=pending')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/applications')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/applications/job/:jobId', () => {
    test('should get applicants for a job', async () => {
      const response = await request(app)
        .get(`/api/applications/job/${testJobId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should reject request by non-owner employer', async () => {
      // Create another employer
      const otherEmployerRes = await request(app).post('/api/auth/register').send({
        email: 'test-other-employer-app@example.com',
        password: 'Password123!',
        role: 'employer',
      });

      const response = await request(app)
        .get(`/api/applications/job/${testJobId}`)
        .set('Authorization', `Bearer ${otherEmployerRes.body.data.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Cleanup
      await User.deleteOne({ email: 'test-other-employer-app@example.com' });
    });

    test('should reject request by job seeker', async () => {
      const response = await request(app)
        .get(`/api/applications/job/${testJobId}`)
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/applications/:id/status', () => {
    test('should update application status', async () => {
      const updateData = {
        status: 'reviewing',
      };

      const response = await request(app)
        .put(`/api/applications/${testApplicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('reviewing');
      expect(response.body.data.statusHistory).toBeDefined();
      expect(response.body.data.statusHistory.length).toBeGreaterThan(0);
    });

    test('should validate status transitions', async () => {
      const updateData = {
        status: 'invalid-status',
      };

      const response = await request(app)
        .put(`/api/applications/${testApplicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should reject status update by job seeker', async () => {
      const updateData = {
        status: 'accepted',
      };

      const response = await request(app)
        .put(`/api/applications/${testApplicationId}/status`)
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should reject status update without authentication', async () => {
      const updateData = {
        status: 'accepted',
      };

      const response = await request(app)
        .put(`/api/applications/${testApplicationId}/status`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/applications/:id', () => {
    test('should get application details', async () => {
      const response = await request(app)
        .get(`/api/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testApplicationId);
    });

    test('should reject access to other user\'s application', async () => {
      // Create another job seeker
      const otherJobSeekerRes = await request(app).post('/api/auth/register').send({
        email: 'test-other-jobseeker@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      });

      const response = await request(app)
        .get(`/api/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${otherJobSeekerRes.body.data.token}`)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Cleanup
      await User.deleteOne({ email: 'test-other-jobseeker@example.com' });
    });
  });

  describe('Application Status History', () => {
    test('should track status changes in history', async () => {
      // Update status multiple times
      await request(app)
        .put(`/api/applications/${testApplicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'interviewing' });

      await request(app)
        .put(`/api/applications/${testApplicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'accepted' });

      const response = await request(app)
        .get(`/api/applications/${testApplicationId}`)
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .expect(200);

      expect(response.body.data.statusHistory.length).toBeGreaterThanOrEqual(3);
      expect(response.body.data.status).toBe('accepted');
    });
  });
});
