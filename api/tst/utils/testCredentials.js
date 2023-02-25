const httpStatus = require('http-status');
const { FINCHART_AUTH_TOKEN } = require('../../@finchart-configs/constants');
const logTestError = require('../utils/logTestError');

const crypto = require('crypto');
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

// Minimum eight and maximum 13 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
const TEST_PASSWORD = 'c%Ft55$2T8pv';
const TEST_PASSWORD_HASH = getHashedPassword(TEST_PASSWORD);
const TEST_USERNAME = 'fatgiraffe';
const TEST_JWT_TOKEN = 'yeet';

const loginTestUser = async (request) => {
  const endpoint = `/api/v1/auth/login`;
  const payload = {
    username: TEST_USERNAME,
    password: TEST_PASSWORD,
  };

  return await request('post', endpoint)
    .send(payload)
    .expect(function (res) {
      if (res.status != httpStatus.CREATED) {
        logTestError(JSON.stringify(res.body, null, 2), res.status);
      }

      return `Authorization ${res.body}`;
    });
};

module.exports = {
  TEST_JWT_TOKEN,
  TEST_PASSWORD,
  TEST_PASSWORD_HASH,
  TEST_USERNAME,
  AUTH_TOKEN_HEADER: FINCHART_AUTH_TOKEN,
  loginTestUser,
};
