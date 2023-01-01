module.exports = {
  displayName: 'client',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['\\.(css|scss|sass)$'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
