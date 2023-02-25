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

module.exports = TableCellSchema;
