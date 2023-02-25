module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  transform: {
    '^.+\\.(js)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'), // stackoverflow.com/questions/49263429
  },
  testMatch: ['**/*.test.js'],
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tst'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tst/utils/globalSetup.js'],
};
