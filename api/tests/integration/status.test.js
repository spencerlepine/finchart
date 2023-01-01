const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../utils/serverInstance');

describe('Status routes', () => {
  describe('GET /api/status', () => {
    test('should return 200 with valid status results', async () => {
      const result = await request(app).get('/api/status').send().expect(httpStatus.OK);
      expect(result.body).toHaveProperty('databaseConnected', true);
    });
  });
});
