/**
 * ESLint Configuration
 * Code quality and style enforcement
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Error prevention
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-debugger': 'warn',

    // Code quality
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-await': 'warn',
    'require-await': 'warn',

    // Style
    'indent': ['warn', 2],
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'semi': ['warn', 'always'],
    'comma-dangle': ['warn', 'never'],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],

    // Best practices
    'curly': ['error', 'all'],
    'no-else-return': 'warn',
    'no-nested-ternary': 'warn',
    'prefer-const': 'warn',
    'no-var': 'warn'
  },
  globals: {
    // Browser globals
    'window': 'readonly',
    'document': 'readonly',
    'console': 'readonly',
    'localStorage': 'readonly',
    'fetch': 'readonly',

    // SearchAdvisor globals
    'SearchAdvisor': 'readonly',
    '__sadvApi': 'readonly',
    '__sadvState': 'writable',
    '__SADV_DEMO_MODE__': 'writable',

    // Test globals
    'describe': 'readonly',
    'test': 'readonly',
    'expect': 'readonly',
    'beforeAll': 'readonly',
    'beforeEach': 'readonly',
    'afterAll': 'readonly',
    'afterEach': 'readonly',
    'jest': 'readonly'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.bundle.js',
    'playwright-report/',
    'test-results/'
  ]
};
