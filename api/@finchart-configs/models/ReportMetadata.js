const joi = require('joi');
const { validateModel, MongooseKeys, ERRORS } = require('./sharedMongoose');

const MODEL_KEY = 'reportMetadata';
const RECORD_ID_KEY = '_id';
const MODIFY_SAFE_KEY = 'title';

const JOI_SCHEMA = joi
  .object()
  .keys({
    userId: joi
      .string()
      .min(3)
      .max(75)
      .required()
      .description('Owner of this report')
      .error(() => new Error(ERRORS.USER_ID_ERROR)),
    title: joi
      .string()
      .default('New Report')
      .description('User-freindly report title')
      .error(() => new Error(ERRORS.TITLE_ERROR)),
    status: joi
      .string()
      .valid('draft', 'complete')
      .default('draft')
      .description('Form completion status')
      .error(() => new Error(ERRORS.STATUS_ERROR)),
    notes: joi
      .string()
      .empty('')
      .max(400)
      .default('')
      .description('Description or notes about report')
      .error(() => new Error(ERRORS.NOTES_ERROR)),
    reportDate: joi
      .string()
      .empty('')
      .default('')
      .description('End date of the report')
      .error(() => new Error(ERRORS.DATE_ERROR)),
    version: joi
      .string()
      .regex(/^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/)
      .default('1.0.0')
      .description('Form version for future compatability')
      .error(() => new Error(ERRORS.VERSION_ERROR)),
    ...MongooseKeys,
  })
  .options({ stripUnknown: true, allowUnknown: true });

const DUMMY_MODEL = {
  userId: 'testUser123',
  title: 'My Q4 Report',
  status: 'draft',
  notes: 'I still need to add taxes',
  reportDate: 'Sat Mar 11 2023 02:55:59 GMT-0800 (Pacific Standard Time)',
  version: '1.0.0',
};

const EXPECTED_VALIDATION_SUCCESSES = [
  DUMMY_MODEL,
  { userId: 'spencer@gmail.com' },
  { title: 'This is a cool Report!' },
  { status: 'complete' },
];

const EXPECTED_VALIDATION_ERRORS = [
  [{ userId: 'js' }, ERRORS.USER_ID_ERROR],
  [{ userId: 'a'.repeat(76) }, ERRORS.USER_ID_ERROR],
  [{ userId: 124 }, ERRORS.USER_ID_ERROR],
  [{ title: 9999 }, ERRORS.TITLE_ERROR],
  [{ notes: 9999 }, ERRORS.NOTES_ERROR],
  [{ notes: 'blahblah'.repeat(99) }, ERRORS.NOTES_ERROR],
  [{ status: 'invalidstatus' }, ERRORS.STATUS_ERROR],
  [{ status: 999 }, ERRORS.STATUS_ERROR],
  [{ version: 100 }, ERRORS.VERSION_ERROR],
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
