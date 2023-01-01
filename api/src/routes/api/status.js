const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const { isDatabaseConnected } = require('../../utils/databaseUtils');

// @route GET api/status
// @description health check endpoint
// @access Public
router.get('/', (req, res) => {
  res.send({
    serverRunning: true,
    databaseConnected: isDatabaseConnected(),
    nodeEnvMode: config.NODE_ENV,
  });
});

module.exports = router;
