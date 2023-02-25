const joi = require('joi');
const { validateModel, MongooseKeys, ERRORS } = require('./sharedMongoose');
const { FORM_PAGE_IDS } = require('../config/FormPagesConfig');
const { v4: uuid } = require('uuid');
const TableCellSchema = require('./TableCell');
const RowSchema = require('./TableRow');

const MODEL_KEY = 'spreadsheet';
const RECORD_ID_KEY = '_id';
const MODIFY_SAFE_KEY = 'tip';

const JOI_SCHEMA = joi
  .object()
  .keys({
    reportId: joi
      .string()
      .required()
      .description('Owner of this report')
      .error(() => new Error(ERRORS.REPORT_ID_ERROR)),
    userId: joi
      .string()
      .min(3)
      .max(75)
      .required()
      .description('Owner of this spreadsheet')
      .error(() => new Error(ERRORS.USER_ID_ERROR)),
    formPageId: joi
      .string()
      .valid(...FORM_PAGE_IDS)
      .required()
      .error(() => new Error(ERRORS.FORM_PAGE_ID_ERROR))
      .description('Respective form page (eg. income, taxes)'),
    name: joi
      .string()
      .max(150)
      .required()
      .description('Name of spreadsheet')
      .error(() => new Error(ERRORS.SPREADSHEET_NAME_ERROR)),
    tip: joi
      .string()
      .max(150)
      .empty('')
      .description('Tip to help user enter spreadsheet info')
      .error(() => new Error(ERRORS.SPREADSHEET_TIP_ERROR)),
    columns: joi
      .array()
      .items(RowSchema)
      .description('Header Column Config compatible w/ ka-table@^7.3.5')
      .error(() => new Error(ERRORS.SPREADSHEET_COLUMN_ERROR)),
    data: joi
      .array()
      .items(TableCellSchema)
      .description('Table Cell Data compatible w/ ka-table@^7.3.5')
      .error(() => new Error(ERRORS.SPREADSHEET_DATA_ERROR)),
    ...MongooseKeys,
  })
  .options({ allowUnknown: true });

const DUMMY_MODEL = {
  reportId: uuid(),
  userId: uuid(),
  formPageId: 'income',
  name: 'Taxes',
  tip: 'Try to provide best estimate',
  columns: [],
  data: [],
};

const EXPECTED_VALIDATION_SUCCESSES = [
  DUMMY_MODEL,
  { userId: 'spencer@gmail.com' },
  { reportId: 'testreport123' },
  ...FORM_PAGE_IDS.map((formPageId) => ({ formPageId })),
  { name: 'short' },
  { name: 'blahblahblahmediumlengthname' },
  { tip: 'This is a sentence about how to help with the form' },
  { columns: [] },
  { data: [] },
];

const EXPECTED_VALIDATION_ERRORS = [
  [{ userId: 999 }, ERRORS.USER_ID_ERROR],
  [{ reportId: 999 }, ERRORS.REPORT_ID_ERROR],
  [{ formPageId: 'nonexistant' }, ERRORS.FORM_PAGE_ID_ERROR],
  [{ formPageId: 999 }, ERRORS.FORM_PAGE_ID_ERROR],
  [{ name: 999 }, ERRORS.SPREADSHEET_NAME_ERROR],
  [{ name: 'blahblah'.repeat(99) }, ERRORS.SPREADSHEET_NAME_ERROR],
  [{ tip: 999 }, ERRORS.SPREADSHEET_TIP_ERROR],
  [{ tip: 'blahblah'.repeat(99) }, ERRORS.SPREADSHEET_TIP_ERROR],
  [{ columns: 999 }, ERRORS.SPREADSHEET_COLUMN_ERROR],
  [{ data: 999 }, ERRORS.SPREADSHEET_DATA_ERROR],
];

module.exports = {
  validateModel: validateModel(JOI_SCHEMA),
  DUMMY_MODEL,
  RECORD_ID_KEY,
  MODEL_KEY,
  MODIFY_SAFE_KEY,
  JOI_SCHEMA,
  EXPECTED_VALIDATION_SUCCESSES,
  EXPECTED_VALIDATION_ERRORS,
};
