/**
 * Integration Tests for Authentication Endpoints
 * **Validates: Requirements 3.1, 3.2, 3.3**
 * 
 * Note: These tests require a test database connection
 * Run with: npm test -- authEndpoints.integration.test.js
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Endpoints - Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({ email: /test.*@example\.com/ });
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up test users before each test
    await User.deleteMany({ email: /test.*@example\.com/ });
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        email: 'test-register@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe(userData.role);
      expect(response.body.data.user.password).toBeUndefined();
    });

    test('should reject registration with existing email', async () => {
      const userData = {
        email: 'test-duplicate@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      };

      // Register first time
      await request(app).post('/api/auth/register').send(userData).expect(201);

      // Try to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    test('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        role: 'job-seeker',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should reject registration with weak password', async () => {
      const userData = {
        email: 'test-weak@example.com',
        password: '123',
        role: 'job-seeker',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should reject registration with invalid role', async () => {
      const userData = {
        email: 'test-role@example.com',
        password: 'Password123!',
        role: 'invalid-role',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app).post('/api/auth/register').send({
        email: 'test-login@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      });
    });

    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('test-login@example.com');
    });

    test('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    test('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'test-forgot@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      });
    });

    test('should send password reset email for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test-forgot@example.com',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('reset');

      // Verify reset token was created
      const user = await User.findOne({ email: 'test-forgot@example.com' });
      expect(user.resetPasswordToken).toBeDefined();
      expect(user.resetPasswordExpire).toBeDefined();
    });

    test('should handle non-existent email gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/reset-password/:token', () => {
    let resetToken;

    beforeEach(async () => {
      // Register user and get reset token
      await request(app).post('/api/auth/register').send({
        email: 'test-reset@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      });

      await request(app).post('/api/auth/forgot-password').send({
        email: 'test-reset@example.com',
      });

      const user = await User.findOne({ email: 'test-reset@example.com' });
      resetToken = user.resetPasswordToken;
    });

    test('should reset password with valid token', async () => {
      const newPassword = 'NewPassword123!';

      const response = await request(app)
        .put(`/api/auth/reset-password/${resetToken}`)
        .send({
          password: newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-reset@example.com',
          password: newPassword,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    test('should reject invalid reset token', async () => {
      const response = await request(app)
        .put('/api/auth/reset-password/invalid-token')
        .send({
          password: 'NewPassword123!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeEach(async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test-me@example.com',
        password: 'Password123!',
        role: 'job-seeker',
      });

      authToken = response.body.data.token;
    });

    test('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test-me@example.com');
    });

    test('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
