const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const { isDatabaseConnected } = require('../../utils/databaseUtils');

/**
 * @api {get} /status Retreive health status
 * @apiName GetHealthStatus
 * @apiGroup Status
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   {
 *     'serverRunning': true,
 *     'databaseConnected': true,
 *     'nodeEnvMode': 'production'
 *   }
 */
router.get('/', (req, res) => {
  res.send({
    serverRunning: true,
    databaseConnected: isDatabaseConnected(),
    nodeEnvMode: config.NODE_ENV,
  });
});

module.exports = router;
