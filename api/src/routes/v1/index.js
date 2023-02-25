const express = require('express');
const router = express.Router();

router.use('/status', require('./status'));
router.use('/user/:userId/reports/:reportId/form', require('./forms'));
router.use('/user/:userId/reports', require('./reports'));
router.use('/user/:userId/import', require('./importer'));
router.use('/auth', require('./auth'));

module.exports = router;
