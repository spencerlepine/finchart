const logger = require('../utils/logger');
const config = require('../config/config');

const errorHandlerMiddleware = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  logger.error(errMsg);

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: config.NODE_ENV === 'development' ? err.stack : {},
  });
};

module.exports = errorHandlerMiddleware;
