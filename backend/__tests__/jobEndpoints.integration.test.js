/**
 * Integration Tests for Job Endpoints
 * **Validates: Requirements 3.4, 3.5**
 * 
 * Note: These tests require a test database connection
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');

describe('Job Endpoints - Integration Tests', () => {
  let employerToken;
  let employerId;
  let jobSeekerToken;
  let testJobId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
    }

    // Create employer user
    const employerRes = await request(app).post('/api/auth/register').send({
      email: 'test-employer-jobs@example.com',
      password: 'Password123!',
      role: 'employer',
    });
    employerToken = employerRes.body.data.token;
    employerId = employerRes.body.data.user._id;

    // Create employer profile
    await EmployerProfile.create({
      userId: employerId,
      companyName: 'Test Company',
      industry: 'Technology',
      companySize: '50-200',
      website: 'https://test.com',
      contactPerson: {
        name: 'Test Person',
        email: 'test@test.com',
        phone: '1234567890',
      },
    });

    // Create job seeker user
    const jobSeekerRes = await request(app).post('/api/auth/register').send({
      email: 'test-jobseeker-jobs@example.com',
      password: 'Password123!',
      role: 'job-seeker',
    });
    jobSeekerToken = jobSeekerRes.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: /test-.*-jobs@example\.com/ });
    await Job.deleteMany({ title: /Test Job/ });
    await EmployerProfile.deleteMany({ companyName: 'Test Company' });
    await mongoose.connection.close();
  });

  describe('POST /api/jobs', () => {
    test('should create a new job posting', async () => {
      const jobData = {
        title: 'Test Job - Software Engineer',
        description: 'This is a test job posting',
        requirements: ['JavaScript', 'React', 'Node.js'],
        responsibilities: ['Develop features', 'Write tests'],
        requiredSkills: ['JavaScript', 'React'],
        experienceLevel: 'mid',
        jobType: 'full-time',
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          remote: false,
        },
        salaryMin: 80000,
        salaryMax: 120000,
        benefits: ['Health insurance', '401k'],
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(jobData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(jobData.title);
      expect(response.body.data.employerId).toBe(employerId);
      
      testJobId = response.body.data._id;
    });

    test('should reject job creation without authentication', async () => {
      const jobData = {
        title: 'Test Job - Unauthorized',
        description: 'This should fail',
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(jobData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject job creation by job seeker', async () => {
      const jobData = {
        title: 'Test Job - Wrong Role',
        description: 'This should fail',
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send(jobData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should reject job creation with missing required fields', async () => {
      const jobData = {
        description: 'Missing title',
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(jobData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/jobs', () => {
    test('should get list of jobs', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    test('should filter jobs by search query', async () => {
      const response = await request(app)
        .get('/api/jobs?search=Software')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter jobs by location', async () => {
      const response = await request(app)
        .get('/api/jobs?location=San Francisco')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should filter jobs by job type', async () => {
      const response = await request(app)
        .get('/api/jobs?jobType=full-time')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should filter jobs by salary range', async () => {
      const response = await request(app)
        .get('/api/jobs?minSalary=70000&maxSalary=150000')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/jobs?page=1&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/jobs/:id', () => {
    test('should get job details by ID', async () => {
      const response = await request(app)
        .get(`/api/jobs/${testJobId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testJobId);
      expect(response.body.data.title).toContain('Test Job');
    });

    test('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/jobs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid job ID', async () => {
      const response = await request(app)
        .get('/api/jobs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/jobs/:id', () => {
    test('should update job by owner', async () => {
      const updateData = {
        title: 'Test Job - Updated Title',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });

    test('should reject update without authentication', async () => {
      const updateData = {
        title: 'Unauthorized Update',
      };

      const response = await request(app)
        .put(`/api/jobs/${testJobId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject update by non-owner', async () => {
      // Create another employer
      const otherEmployerRes = await request(app).post('/api/auth/register').send({
        email: 'test-other-employer@example.com',
        password: 'Password123!',
        role: 'employer',
      });

      const updateData = {
        title: 'Unauthorized Update',
      };

      const response = await request(app)
        .put(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${otherEmployerRes.body.data.token}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Cleanup
      await User.deleteOne({ email: 'test-other-employer@example.com' });
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    test('should delete job by owner', async () => {
      // Create a job to delete
      const jobData = {
        title: 'Test Job - To Delete',
        description: 'This job will be deleted',
        requiredSkills: ['Test'],
        experienceLevel: 'entry',
        jobType: 'full-time',
        location: { city: 'Test', state: 'TS', country: 'USA' },
      };

      const createRes = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(jobData);

      const jobToDeleteId = createRes.body.data._id;

      const response = await request(app)
        .delete(`/api/jobs/${jobToDeleteId}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify job is deleted
      const getRes = await request(app)
        .get(`/api/jobs/${jobToDeleteId}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    test('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/jobs/${testJobId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/jobs/employer/my-jobs', () => {
    test('should get employer\'s own jobs', async () => {
      const response = await request(app)
        .get('/api/jobs/employer/my-jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/jobs/employer/my-jobs')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject request by job seeker', async () => {
      const response = await request(app)
        .get('/api/jobs/employer/my-jobs')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
