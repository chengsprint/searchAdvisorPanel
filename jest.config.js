/**
 * Jest Configuration
 * Testing framework for unit and integration tests
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Root directory for tests
  roots: ['<rootDir>/tests'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Files to include in coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/**/polyfill.js',
    '!src/**/react-bundle.js',
    '!src/**/style.js',
    '!**/node_modules/**',
    '!dist/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60
    }
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json-summary'
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Transform files
  transform: {},

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/playwright/',
    '/tests/v1-migration.test.js',
    '/tests/react18-compat.test.js',
    '/tests/merge-test.js'
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Reset modules between tests
  resetModules: true,

  // Verbose output
  verbose: true,

  // Max workers (use 1 for CI)
  maxWorkers: process.env.CI ? 1 : '50%',

  // Test timeout (ms)
  testTimeout: 10000,

  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',

  // Module name mapper for aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/tests/$1'
  },

  // Globals
  globals: {
    'test-utils': true
  },

  // Coverage provider
  coverageProvider: 'v8'
};
