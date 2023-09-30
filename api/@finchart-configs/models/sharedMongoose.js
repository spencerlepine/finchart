const joi = require('joi');
const { v4: uuid } = require('uuid');
const { FORM_PAGE_IDS } = require('../config/FormPagesConfig');

const updateModelInDatabase = (model, newUserObject, query, options = {}, returnOptions) => {
  const { _id, ...strippedKeys } = newUserObject;
  return model.findOneAndUpdate(query, strippedKeys, options).then((document) => {
    return formattedMongooseDocument(document, returnOptions);
  });
};
exports.updateModelInDatabase = updateModelInDatabase;

const createModelInDatabase = (model, RECORD_ID_KEY, newUserObject, options) => {
  const DocumentToCreate = Object.assign({}, newUserObject);
  if (RECORD_ID_KEY === '_id') DocumentToCreate._id = uuid();

  return model.create(DocumentToCreate).then((document) => {
    return formattedMongooseDocument(document, options);
  });
};
exports.createModelInDatabase = createModelInDatabase;

const deleteModelInDatabase = (model, query) => {
  return model
    .deleteOne(query)
    .then((deleteResult) => {
      return deleteResult;
    })
    .catch(() => ({
      acknowledged: true,
      deletedCount: 0,
    }));
};
exports.deleteModelInDatabase = deleteModelInDatabase;

const findOneModelInDatabase = (model, query, options) => {
  return model.findOne(query).then((document) => {
    return formattedMongooseDocument(document, options);
  });
};
exports.findOneModelInDatabase = findOneModelInDatabase;

const findAllModelsInDatabase = (model, query, options) => {
  return model.find(query).then((documents) => {
    return documents ? documents.map((document) => formattedMongooseDocument(document, options)) : [];
  });
};
exports.findAllModelsInDatabase = findAllModelsInDatabase;

const insertManyInDatabase = (model, newDocuments, options) => {
  return model.insertMany(newDocuments).then((documents) => {
    return documents ? documents.map((document) => formattedMongooseDocument(document, options)) : [];
  });
};
exports.insertManyInDatabase = insertManyInDatabase;

const formattedMongooseDocument = (document, options = { timestamps: false, _id: false }) => {
  if (!document) {
    return;
  }

  const ParsedDocument = document.toObject();
  if (options.timestamps !== true) {
    delete ParsedDocument.createdAt;
    delete ParsedDocument.updatedAt;
  }
  if (options._id !== true) {
    delete ParsedDocument._id;
  }
  delete ParsedDocument.__v;
  return ParsedDocument;
};
exports.formattedMongooseDocument = formattedMongooseDocument;

exports.validateModel = (JOI_SCHEMA) => (userObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      await JOI_SCHEMA.validateAsync(userObject);
    } catch (err) {
      return reject(err.message);
    }
    resolve(userObject);
  });
};

exports.MongooseKeys = {
  _id: joi.string().optional(),
  createdAt: joi.string().optional().empty('2022-12-12T03:06:21.711Z'),
  updatedAt: joi.string().optional().empty('2022-12-12T03:06:21.711Z'),
};

exports.ERRORS = {
  PASSWORD_ERROR: 'Password must include 8-13 characters, one uppercase, lowercase, number, and special character',
  USERNAME_ERROR: 'Username must be at least 3, and max 75 characters',
  USER_ID_ERROR: 'Username must be at least 3, and max 75 characters',
  REPORT_ID_ERROR: 'Report id must be valid uuid',
  FORM_PAGE_ID_ERROR: `Invalid form page: ${JSON.stringify(FORM_PAGE_IDS)}`,
  SPREADSHEET_NAME_ERROR: 'Spreadsheet name cannot be more than 150 characters',
  SPREADSHEET_TIP_ERROR: 'Spreadsheet tip cannot be more than 150 characters',
  SPREADSHEET_COLUMN_ERROR: 'Spreadsheet columns must follow ka-table@^7.3.5 schema',
  SPREADSHEET_DATA_ERROR: 'Spreadsheet data must follow ka-table@^7.3.5 schema',
  USER_ID_ERROR: 'UserId must be valid string',
  TITLE_ERROR: 'Rreport title cannot be over 100 characters',
  STATUS_ERROR: 'Status can only be complete/draft',
  NOTES_ERROR: 'Report notes cannot be over 255 characters',
  DATE_ERROR: 'Report date must be valid date string',
  VERSION_ERROR: 'Accepting semver form version, starting at 1.0.0',
};
