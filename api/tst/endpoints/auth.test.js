const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../utils/serverInstance');
const { TEST_USERNAME, TEST_PASSWORD } = require('../utils/testCredentials');
const logTestError = require('../utils/logTestError');

describe('Auth routes', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should return 403 given fake credentials', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'fakeValidusername', password: TEST_PASSWORD })
        .expect(httpStatus.FORBIDDEN);
    });

    it('should return 422 given invalid credentials', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'fakeValidusername', password: 'invalidpassword' })
        .expect(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 201 with valid JWT given valid credentials', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ username: TEST_USERNAME, password: TEST_PASSWORD })
        .expect(function (res) {
          if (res.status != httpStatus.CREATED) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body).toMatch(/(^[\w-]*\.[\w-]*\.[\w-]*$)/);
        })
        .expect(httpStatus.CREATED);
    });
  });
});
