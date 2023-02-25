const joi = require('joi');

const TableRow = joi.object({
  key: joi.string().min(1).max(25).required(),
  title: joi.string().min(1).max(25).required(),
  dataType: joi.string().valid('string', 'number').default('string'),
});

module.exports = TableRow;
