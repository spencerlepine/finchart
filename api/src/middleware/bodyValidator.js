const createHttpError = require('http-errors');
const logger = require('../utils/logger');
const Validators = require('../validators');

/**
 * Validates request body against Joi schema
 * @param {*} schemaKey
 * @param {*} options
 * @returns next middleware invocation
 */
module.exports = function (schemaKey, options = {}) {
  //! If validator is not exist, throw err
  if (!Validators.hasOwnProperty(schemaKey)) throw new Error(`'${schemaKey}' schema does not exist`);
  return async function (req, res, next) {
    try {
      const validated = await Validators[schemaKey].validateAsync(req.body);
      if (!options.allowUnknown) {
        req.body = validated;
      }
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
