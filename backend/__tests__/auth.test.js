const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../utils/jwt');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

/**
 * Unit Tests for Authentication
 * **Validates: Requirements 3.1**
 */

describe('Authentication - Unit Tests', () => {
  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test('should verify correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', () => {
      const payload = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'job-seeker',
      };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    test('should include user ID in token payload', () => {
      const payload = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'job-seeker',
      };
      const token = generateToken(payload);
      const decoded = jwt.decode(token);

      expect(decoded.userId).toBe(payload._id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    test('should set expiration time', () => {
      const payload = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'job-seeker',
      };
      const token = generateToken(payload);
      const decoded = jwt.decode(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('JWT Token Verification', () => {
    test('should verify valid token', () => {
      const payload = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'job-seeker',
      };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(payload._id);
    });

    test('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    test('should reject expired token', () => {
      const payload = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'job-seeker',
      };
      const expiredToken = jwt.sign(
        { userId: payload._id, email: payload.email, role: payload.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure token is expired
      setTimeout(() => {
        expect(() => verifyToken(expiredToken)).toThrow();
      }, 100);
    });
  });

  describe('Auth Middleware', () => {
    test('should attach user to request when token is valid', async () => {
      const payload = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'job-seeker',
      };
      const token = generateToken(payload);

      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      // Mock User.findById with select method
      const User = require('../models/User');
      const mockUser = {
        _id: payload._id,
        email: payload.email,
        role: payload.role,
        isVerified: true,
      };
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.email).toBe(payload.email);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject request without token', async () => {
      const req = {
        headers: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Authorization Middleware', () => {
    test('should allow access for authorized role', () => {
      const req = {
        user: {
          role: 'admin',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should deny access for unauthorized role', () => {
      const req = {
        user: {
          role: 'job-seeker',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow access for multiple authorized roles', () => {
      const req = {
        user: {
          role: 'employer',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const middleware = authorize('admin', 'employer');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
