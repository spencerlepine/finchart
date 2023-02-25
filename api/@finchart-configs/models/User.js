const joi = require('joi');
const { validateModel, ERRORS } = require('./sharedMongoose');

const MODEL_KEY = 'user';
const RECORD_ID_KEY = 'username';
const MODIFY_SAFE_KEY = 'username';

const JOI_SCHEMA = joi.object({
  username: joi
    .string()
    .min(3)
    .max(75)
    .required()
    .error(() => new Error(ERRORS.USERNAME_ERROR)),
  password: joi
    .string()
    .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,13}$/))
    .min(3)
    .max(75)
    .required()
    .error(() => new Error(ERRORS.PASSWORD_ERROR)),
});

const DUMMY_MODEL = {
  username: 'spencer@gmail.com',
  password: 'C%ft45$2T8pY',
};

const EXPECTED_VALIDATION_SUCCESSES = [
  DUMMY_MODEL,
  { username: 'spencer@gmail.com' },
  { username: 'spencer@yahoo.com' },
  { password: 'C%ft45$2T8pY' },
];

const EXPECTED_VALIDATION_ERRORS = [
  [{ username: 'js' }, ERRORS.USERNAME_ERROR],
  [{ username: 124 }, ERRORS.USERNAME_ERROR],
  [{ password: 'easypassword' }, ERRORS.PASSWORD_ERROR],
  [{ password: 'Ithinkthisisahard9217&&&passwordtoguess' }, ERRORS.PASSWORD_ERROR],
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
