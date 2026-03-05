module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/scripts'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['scripts/**/*.js', '!scripts/**/__tests__/**'],
};

