const createHttpError = require('http-errors');
const logger = require('../utils/logger');
const Validators = require('../validators');

/**
 * Validates request parameters against Joi schema
 * @param {*} schemaKey
 * @param {*} options
 * @returns next middleware invocation
 */
module.exports = function (...expectedParams) {
  return async function (req, res, next) {
    // Validate all expected params are present
    for (let i = 0; i < expectedParams.length; i++) {
      if (!req.params[expectedParams[i]]) {
        return next(createHttpError(422, { message: `missing parameter: ${expectedParams[i]}` }));
      }
    }

    // Validate used params to schema definitions
    try {
      await Validators['commonParams'].validateAsync(req.params);
      next();
    } catch (err) {
      logger.error(err);

      //* Pass err to next
      //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
      if (err.isJoi) return next(createHttpError(422, { message: err.message }));
      next(createHttpError(500));
    }
  };
};
