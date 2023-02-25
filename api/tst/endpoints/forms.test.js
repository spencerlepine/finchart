const supertest = require('supertest');
const httpStatus = require('http-status');
const app = require('../utils/serverInstance');
const { loginTestUser, TEST_USERNAME } = require('../utils/testCredentials');
const logTestError = require('../utils/logTestError');

const BASE_URL = '/api/v1';

describe('Form routes', () => {
  let testJWTToken = null;
  const request = (method, endpoint) => supertest(app)[method](endpoint).set('Authorization', testJWTToken);
  const handleLogin = async () => {
    const loginResult = await loginTestUser(request);
    testJWTToken = loginResult.body;
  };
  beforeAll(async () => {
    await handleLogin();
  });

  let testReportId = null;
  const initReport = async () => {
    const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports`;
    const payload = {
      title: 'My Cool New Report!',
      userId: TEST_USERNAME,
    };

    await request('post', endpoint)
      .send(payload)
      .expect(function (res) {
        if (res.status != httpStatus.CREATED) {
          logTestError(JSON.stringify(res.body, null, 2), res.status);
        }

        expect(res.body).toHaveProperty('_id');
        testReportId = res.body['_id'];
        expect(testReportId).not.toBe(null);
      });
  };

  let incomeFormPageData = { data: [] };
  describe('GET /api/v1/user/:userId/reports/:reportId/form/:pageId', () => {
    it('should retrieve single form page spreadsheet', async () => {
      await initReport();

      const testFormPageId = 'income';
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${testReportId}/form/${testFormPageId}`;

      await request('get', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.OK) {
            logTestError(JSON.stringify(res.body, null, 2), res.status);
          }

          expect(res.body).toHaveProperty('formPageId', 'income');
          expect(res.body).toHaveProperty('prevFormPageId');
          expect(res.body).toHaveProperty('nextFormPageId');
          expect(res.body).toHaveProperty('columns');
          expect(res.body).toHaveProperty('data');
          incomeFormPageData = Object.assign({}, res.body);
          expect(incomeFormPageData).toHaveProperty('data');
        })
        .expect(httpStatus.OK);
    });

    it('should fail given invalid params', async () => {
      const testFormPageId = 'INVALID';
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${testReportId}/form/${testFormPageId.repeat(25)}`;

      await request('get', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('POST /api/v1/user/:userId/reports/:reportId/form/:pageId', () => {
    it('should update single form page spreadsheet', async () => {
      const testFormPageId = 'income';
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${testReportId}/form/${testFormPageId}`;
      const modifiedSpreadsheet = {
        data: [
          ...incomeFormPageData.data,
          {
            id: 1,
            name: 'Civilian Job',
            'monthly-gross': 99999,
          },
        ],
      };

      await request('post', endpoint)
        .send(modifiedSpreadsheet)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.OK) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body).toHaveProperty('formPageId', 'income');
          expect(res.body).toHaveProperty('columns');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveLength(1);
          const tableRow = res.body.data[0];
          expect(tableRow).toHaveProperty('id', 1);
          expect(tableRow).toHaveProperty('monthly-gross', 99999);
        })
        .expect(httpStatus.OK);
    });

    it('should update multiple rows of form page spreadsheet', async () => {
      const testFormPageId = 'income';
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${testReportId}/form/${testFormPageId}`;

      const modifiedSpreadsheet = {
        data: [
          ...incomeFormPageData.data,
          {
            id: 1,
            name: 'Civilian Job',
            'monthly-gross': 99999,
          },
          {
            id: 2,
            name: 'Side Hustle',
            'monthly-gross': 88888,
          },
          {
            id: 3,
            name: 'Dividends',
            'monthly-gross': 77777,
          },
        ],
      };

      await request('post', endpoint)
        .send(modifiedSpreadsheet)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.OK) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body).toHaveProperty('formPageId', 'income');
          expect(res.body).toHaveProperty('columns');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveLength(3);
          expect(res.body.data[0]).toHaveProperty('id', 1);
          expect(res.body.data[0]).toHaveProperty('monthly-gross', 99999);
          expect(res.body.data[1]).toHaveProperty('id', 2);
          expect(res.body.data[1]).toHaveProperty('monthly-gross', 88888);
          expect(res.body.data[2]).toHaveProperty('id', 3);
          expect(res.body.data[2]).toHaveProperty('monthly-gross', 77777);
        })
        .expect(httpStatus.OK);
    });

    it('should update and remove rows of form page spreadsheet', async () => {
      const testFormPageId = 'income';
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${testReportId}/form/${testFormPageId}`;

      const modifiedSpreadsheet = {
        data: [
          ...incomeFormPageData.data,
          {
            id: 1,
            name: 'Civilian Job',
            'monthly-gross': 99999,
          },
          {
            id: 2,
            name: 'Side Hustle',
            'monthly-gross': 88888,
          },
        ],
      };

      await request('post', endpoint)
        .send(modifiedSpreadsheet)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.OK) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveLength(2);
          expect(res.body.data[0]).toHaveProperty('id', 1);
          expect(res.body.data[0]).toHaveProperty('monthly-gross', 99999);
          expect(res.body.data[1]).toHaveProperty('id', 2);
          expect(res.body.data[1]).toHaveProperty('monthly-gross', 88888);
        })
        .expect(httpStatus.OK);
    });

    it('should fail given invalid params', async () => {
      const testFormPageId = 'INVALID';
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${testReportId}/form/${testFormPageId}`;

      await request('post', endpoint).send().set('Accept', 'application/json; charset=utf-8').expect(httpStatus.BAD_REQUEST);
    });
  });
});
