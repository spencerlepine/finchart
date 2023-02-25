const supertest = require('supertest');
const httpStatus = require('http-status');
const app = require('../utils/serverInstance');
const { loginTestUser, TEST_USERNAME } = require('../utils/testCredentials');
const { Spreadsheet } = require('../../src/models');
const SpreadsheetMongoose = Spreadsheet.MongooseModel;
const { findAllModelsInDatabase } = require('../../src/models');
const DUMMY_REPORTS = require('../utils/dummyReports');
const logTestError = require('../utils/logTestError');

const BASE_URL = '/api/v1';

describe('Report routes', () => {
  let testJWTToken = null;
  const request = (method, endpoint) => supertest(app)[method](endpoint).set('Authorization', testJWTToken);
  const handleLogin = async () => {
    const loginResult = await loginTestUser(request);
    testJWTToken = loginResult.body;
  };
  beforeAll(async () => {
    await handleLogin();
  });

  let initialTestReportId = null;

  describe('POST /api/v1/user/:userId/reports', () => {
    it('should return 201 and create a report', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports`;
      const payload = {
        title: 'My Cool New Report!',
        userId: TEST_USERNAME,
      };

      await request('post', endpoint)
        .send(payload)
        .set('Accept', 'application/json; charset=utf-8')
        .expect((res) => {
          if (res.status != httpStatus.CREATED) {
            logTestError(JSON.stringify(res.body, null, 2));
          }
          expect(res.body).toHaveProperty('_id');
          initialTestReportId = res.body['_id'];
        })
        .expect(httpStatus.CREATED);

      await findAllModelsInDatabase(SpreadsheetMongoose, { reportId: initialTestReportId }).then((res) => {
        expect(res.length).toBeGreaterThanOrEqual(10);
      });
    });

    it('should not create report given invalid metadata', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports`;
      const payload = {
        title: 9999,
        userId: TEST_USERNAME,
        fakeKey: 'n'.repeat(100),
      };

      await request('post', endpoint)
        .send(payload)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.UNPROCESSABLE_ENTITY) {
            logTestError(JSON.stringify(res.body, null, 2));
          }
        })
        .expect(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('GET /api/v1/user/:userId/reports/:reportId', () => {
    it('should return new user report', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${initialTestReportId}`;

      await request('get', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.OK) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body).toHaveProperty('id', initialTestReportId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('status', 'draft');
          expect(res.body).toHaveProperty('notes');
        })
        .expect(httpStatus.OK);
    });

    it('should not return report given invalid params', async () => {
      const endpoint = `${BASE_URL}/user/nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn/reports/${initialTestReportId}`;

      await request('get', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.UNPROCESSABLE_ENTITY) {
            logTestError(JSON.stringify(res.body, null, 2));
          }
        })
        .expect(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('GET /api/v1/user/:userId/reports', () => {
    it('should return all user reports', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports`;

      await request('get', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != httpStatus.OK) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body.length).toBe(1);
        })
        .expect(httpStatus.OK);
    });

    it('should throw error given invalid user', async () => {
      const FAKE_USER_ID = 'NOT_REAL_USER12034-1029::::::348';
      const endpoint = `${BASE_URL}/user/${FAKE_USER_ID}/reports`;

      await request('get', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('DELETE /api/v1/user/:userId/reports/:reportId', () => {
    it('should delete latest user report', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${initialTestReportId}`;

      await request('delete', endpoint)
        .send()
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != 204) {
            logTestError(JSON.stringify(res.body, null, 2));
          }
        })
        .expect(204);
    });

    it('should not delete non-existent user report', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/fakeReportId`;

      await request('delete', endpoint).send().expect(httpStatus.NO_CONTENT);
    });
  });

  describe('GET /api/v1/user/:userId/reports/:reportId/export', () => {
    it('should return entire report export JSON data', async () => {
      let exportTestReportId = null;

      // Arrange
      await request('post', `${BASE_URL}/user/${TEST_USERNAME}/reports`)
        .send({
          title: 'Report to Export',
          userId: TEST_USERNAME,
        })
        .set('Accept', 'application/json; charset=utf-8')
        .expect(async (res) => {
          if (res.status != httpStatus.CREATED) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          exportTestReportId = res.body['_id'];
        })
        .expect(httpStatus.CREATED);

      // Assert
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${exportTestReportId}/export`;
      await request('get', endpoint)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != 200) {
            logTestError(JSON.stringify(res.body, null, 2));
          }

          expect(res.body).toHaveProperty('id', exportTestReportId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body).toHaveProperty('spreadsheets');
          expect(res.body).toHaveProperty('version');
          expect(res.body).not.toHaveProperty('_id');
          expect(res.body).not.toHaveProperty('__v');
          expect(Array.isArray(res.body.spreadsheets)).toBeTruthy();

          res.body.spreadsheets.forEach((spreadsheetData) => {
            expect(spreadsheetData).not.toHaveProperty('_id');
            expect(spreadsheetData).not.toHaveProperty('__v');
            expect(spreadsheetData).not.toHaveProperty('createdAt');
            expect(spreadsheetData).not.toHaveProperty('updatedAt');
            expect(spreadsheetData).toHaveProperty('formPageId');
            expect(spreadsheetData).toHaveProperty('reportId');
            expect(spreadsheetData).toHaveProperty('userId');
            expect(spreadsheetData).toHaveProperty('name');
            expect(spreadsheetData).toHaveProperty('data');
            expect(spreadsheetData).toHaveProperty('columns');
            expect(spreadsheetData).toHaveProperty('prevFormPageId');
            expect(spreadsheetData).toHaveProperty('nextFormPageId');
          });
        })
        .expect(200);
    });
  });

  describe('POST /api/v1/user/:userId/import', () => {
    let importedReportId = null;
    it('should import entire report from JSON', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/import`;

      await request('post', endpoint)
        .send(DUMMY_REPORTS.VALID.EMPTY_DATA_REPORT)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != 201) {
            logTestError(JSON.stringify(res.body, null, 2), res.status);
          }

          expect(res.body).toHaveProperty('id');
          importedReportId = res.body.id;
        })
        .expect(201);
    });

    it('should retrieve newly imported report from database', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/reports/${importedReportId}`;
      await request('get', endpoint)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != 200) {
            logTestError(JSON.stringify(res.body, null, 2), res.status);
          }

          expect(res.body).toHaveProperty('id');
        })
        .expect(200);
    });

    it('should not import JSON report when missing spreadsheet', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/import`;

      await request('post', endpoint)
        .send(DUMMY_REPORTS.INVALID.MISSING_PAGE)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(function (res) {
          if (res.status != 400) {
            logTestError(JSON.stringify(res.body, null, 2), res.status);
          }
        })
        .expect(400);
    });

    it('should not import JSON report when missing column in config', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/import`;

      await request('post', endpoint)
        .send(DUMMY_REPORTS.INVALID.MISSING_COLUMN)
        .set('Accept', 'application/json; charset=utf-8')
        .expect(400);
    });

    it('should not import JSON report when missing data in row', async () => {
      const endpoint = `${BASE_URL}/user/${TEST_USERNAME}/import`;

      await request('post', endpoint).send(DUMMY_REPORTS.INVALID.MISSING_ROW_DATA).expect(400);
    });
  });
});
