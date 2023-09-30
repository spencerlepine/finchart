const dotenv = require('dotenv');
const testCredentials = require('../../tst/utils/testCredentials');
dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/yourDBName',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  PATH_AUTH_WHITELIST: ['/login', '/signup', '/status', '/auth/login'],
  CUSTOM_USERNAME: process.env.CUSTOM_USERNAME || testCredentials.TEST_USERNAME,
  CUSTOM_HASHED_PASSWORD: process.env.CUSTOM_HASHED_PASSWORD || testCredentials.TEST_PASSWORD_HASH,
  JWT_TOKEN: process.env.JWT_TOKEN || testCredentials.TEST_JWT_TOKEN,
};

module.exports = config;
