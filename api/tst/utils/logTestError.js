const logger = require('../../src/utils/logger');

module.exports = (error) => {
  logger.error('[FAILURE]:', error);
};
