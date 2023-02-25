const joi = require('joi');

const createReportSchema = joi
  .object({
    userId: joi.string().min(4).max(99).required(),
    title: joi.string().min(5).max(125).required(),
  })
  .options({ stripUnknown: true });

module.exports = createReportSchema;
