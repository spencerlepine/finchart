const winston = require('winston');
const loggerConfig = require('../config/logger.config.json');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(loggerConfig.options.console),
    new winston.transports.Console(loggerConfig.options.file),
  ],
});

module.exports = logger;
