const joi = require('joi');
const { FORM_PAGE_IDS } = require('../config/FormPagesConfig');

const CommonParamsSchema = joi.object({
  pageId: joi.string().min(3).max(75),
  userId: joi
    .string()
    .regex(new RegExp(/^[0-9a-zA-Z]{6,12}$/))
    .min(3)
    .max(75),
  reportId: joi.string().min(3).max(128),
  formPageId: joi.string().valid(...FORM_PAGE_IDS),
});

module.exports = CommonParamsSchema;
