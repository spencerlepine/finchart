const express = require('express');
const router = express.Router({ mergeParams: true });
const BodyValidator = require('../../middleware/bodyValidator');
const ParamValidator = require('../../middleware/paramValidator');
const reportsController = require('../../controllers/reports');

/**
 * @apiDefine ReportsGroup Reports
 *
 * Handling CRUD operations for all user reports.
 */

/**
 * @api {post} /user/:userId/reports Create a report
 * @apiName CreateUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiPermission Authorized users only
 *
 * @apiParamExample {json} Request Body Example:
 *     {
 *       'userId': 'asl83hfi285hdfn3858',
 *       'title': 'My 2022 Report',
 *     }
 */
router.post('/', ParamValidator('userId'), BodyValidator('createReport'), reportsController.createUserReport);

/**
 * @api {delete} /user/:userId/reports/:reportId Delete a report
 * @apiName DeleteUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiParam {String} reportId Report unique ID.
 * @apiPermission Authorized users only
 */
router.delete('/:reportId', ParamValidator('userId', 'reportId'), reportsController.deleteUserReports);

/**
 * @api {get} /user/:userId/reports Retreive reports list
 * @apiName GetUserReports
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiPermission Authorized users only
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *        { 'id', 'title', ...},
 *        { 'id', 'title', ...}
 *     ]
 */
router.get('/', ParamValidator('userId'), reportsController.getUserReports);

/**
 * @api {get} /user/:userId/reports/latest Retrieve latest report
 * @apiName GetUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiPermission Authorized users only
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': '00df92845nfjc9385nhd294',
 *       'title': 'My Latest Report',
 *       'status': 'draft',
 *       'notes': 'This is my first report',
 *       'version': '1.0.0',
 *       'updatedAt': '2020-07-06T20:36:59.414Z',
 *       'createdAt': '2020-07-06T20:36:59.414Z'
 *     }
 */
router.get('/latest', ParamValidator('userId'), reportsController.getLatestUserReport);

/**
 * @api {get} /user/:userId/reports/:reportId Retreive one report
 * @apiName GetUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiParam {String} reportId Report unique ID.
 * @apiPermission Authorized users only
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'id': '00df92845nfjc9385nhd294',
 *       'title': 'My 2023 Report',
 *       'status': 'draft',
 *       'notes': 'This is my first report',
 *       'version': '1.0.0',
 *       'updatedAt': '2020-07-06T20:36:59.414Z',
 *       'createdAt': '2020-07-06T20:36:59.414Z'
 *     }
 */
router.get('/:reportId', ParamValidator('userId', 'reportId'), reportsController.getUserReport);

/**
 * @api {put} /user/:userId/reports/:reportId Update report metadata
 * @apiName UpdateUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiParam {String} reportId Report unique ID.
 * @apiPermission Authorized users only
 *
 * @apiParamExample {json} Request Body Example:
 *     {
 *       'title': 'My 2023 Report',
 *       'status': 'draft',
 *       'notes': 'Was attending university, budget was adjusted',
 *     }
 */
router.put(
  '/:reportId',
  ParamValidator('userId', 'reportId'),
  BodyValidator('updateReportMetadata'),
  reportsController.updateUserReport
);

/**
 * @api {get} /user/:userId/reports/:reportId/export Export report JSON
 * @apiName ExportOneUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiParam {String} reportId Report unique ID.
 * @apiPermission Authorized users only
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        'id': 'aJhD-92850-dsafa',
 *        'title': 'Q4 FY2023 Networth',
 *        'updatedAt': '2022-05-04T12:00:53.307Z',
 *        'columns': [...],
 *        'data': [...],
 *        'version: '1.0.0'
 *     }
 */
router.get('/:reportId/export', ParamValidator('userId'), reportsController.exportOneUserReport);

module.exports = router;
