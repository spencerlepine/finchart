const joi = require('joi');
const { POSSIBLE_COLUMN_KEYS } = require('../config/FormPagesConfig');

const PossibleCellKeys = {};
POSSIBLE_COLUMN_KEYS.forEach((possibleKey) => (PossibleCellKeys[possibleKey] = joi.optional()));
const TableCellSchema = joi
  .object()
  .keys({
    id: joi.number().min(0).max(999).required(),
    ...PossibleCellKeys,
  })
  .min(1)
  .options({ allowUnknown: true });

const updateSpreadsheet = joi
  .object({
    // Don't allow users to modify columns (yet)
    // columns: joi.array().items(ColumnSchema).description('Header Column Config compatible w/ ka-table@^7.3.5'),
    data: joi.array().items(TableCellSchema).description('Table Cell Data compatible w/ ka-table@^7.3.5'),
  })
  .options({ stripUnknown: true });

module.exports = updateSpreadsheet;
