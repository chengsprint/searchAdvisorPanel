/**
 * Jest Test Setup
 * Global test configuration and utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Test utilities
global.testUtils = {
  // Mock data generator
  generateMockData: (schema = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    ...schema
  }),

  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Create mock function with timeout
  createTimedMock: (fn, timeout = 5000) => {
    return (...args) => {
      return Promise.race([
        fn(...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);
    };
  },

  // Assert async throws
  asyncThrows: async (fn, expectedError) => {
    try {
      await fn();
      throw new Error('Expected function to throw');
    } catch (error) {
      if (expectedError && !error.message.includes(expectedError)) {
        throw new Error(`Expected error containing "${expectedError}", got "${error.message}"`);
      }
    }
  }
};

// Mock localStorage for Node.js environment
global.localStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  },
  get length() {
    return Object.keys(this.store).length;
  },
  key: function(index) {
    return Object.keys(this.store)[index] || null;
  }
};

// Mock fetch API
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  global.localStorage.clear();
});

console.log('✅ Jest test setup complete');
