const express = require('express');
const router = express.Router({ mergeParams: true });
const ParamValidator = require('../../middleware/paramValidator');
const reportsController = require('../../controllers/reports');

/**
 * @api {post} /user/:userId/import Import report JSON
 * @apiName ImportOneUserReport
 * @apiGroup ReportsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiPermission Authorized users only
 *
 * @apiParamExample {json} Request Body Example:
 *     {
 *       'id':
 *       'title':
 *       // ...
 *       'spreadsheets': [
 *          {
 *             'formPageId': 'income'
 *             'columns': [...]
 *             'data': [...]
 *          }
 *       ]
 *     }
 */
router.post('/', ParamValidator('userId'), reportsController.importOneUserReport);

module.exports = router;
