// Set up test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRE = '30d';
process.env.NODE_ENV = 'test';

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
