const joi = require('joi');

const updateReportMetadata = joi
  .object({
    title: joi.string().min(5).max(125),
    status: joi.string().valid('draft', 'complete').default('draft').description('Form completion status'),
    notes: joi.string().max(360).default('').optional().description('Description or notes about report'),
  })
  .options({ stripUnknown: true });

module.exports = updateReportMetadata;
