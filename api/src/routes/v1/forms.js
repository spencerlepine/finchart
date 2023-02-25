const express = require('express');
const router = express.Router({ mergeParams: true });
const formsController = require('../../controllers/forms');

/**
 * @apiDefine FormsGroup Forms
 *
 * Handling spreadsheet read/updates for paginated forms in each report.
 */

const ParamValidator = require('../../middleware/paramValidator');
const BodyValidator = require('../../middleware/bodyValidator');

/**
 * @api {get} /user/:userId/reports/:reportId/form/:pageId Retreive spreadsheet data
 * @apiName GetFormPage
 * @apiGroup FormsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiParam {String} reportId Report unique ID.
 * @apiParam {String} pageId Form page key.
 * @apiPermission Authorized users only
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     'formPageId': 'spending',
 *     'prevFormPageId': 'taxes',
 *     'nextFormPageId': 'income',
 *     'columns': [
 *          {
 *           key: 'name',
 *           title: 'Name',
 *           dataType: 'string',
 *          },
 *          // ...
 *      ],
 *     'data': [
 *         // ...
 *      ],
 *   }
 */
router.get('/:pageId', ParamValidator('userId', 'reportId', 'pageId'), formsController.getFormPage);

/**
 * @api {post} /user/:userId/reports/:reportId/form/:pageId Update spreadsheet data
 * @apiName UpdateFormPage
 * @apiGroup FormsGroup
 *
 * @apiParam {String} userId User unique ID.
 * @apiParam {String} reportId Report unique ID.
 * @apiParam {String} pageId Form page key.
 * @apiParamExample {json} Request Body Example:
 *     {
 *       'data': [
 *           {
 *               id: 0
 *               'item': 'Groceries',
 *               'monthly-total': '999'
 *            }
 *       ]
 *     }
 * @apiPermission Authorized users only
 */
router.post(
  '/:pageId',
  ParamValidator('userId', 'reportId', 'pageId'),
  BodyValidator('updateSpreadsheet', { allowUnknown: true }),
  formsController.updateFormPage
);

module.exports = router;
