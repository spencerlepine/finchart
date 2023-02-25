const {
  createModelInDatabase,
  findOneModelInDatabase,
  updateModelInDatabase,
  deleteModelInDatabase,
} = require('./sharedMongoose');
const { v4: uuid } = require('uuid');

const { User, ReportMetadata, Spreadsheet } = require('./index');

const MODELS = [
  ['User', User],
  ['ReportMetadata', ReportMetadata],
  ['Spreadsheet', Spreadsheet],
];

describe.each(MODELS)('%s model validation', (modelName, Model) => {
  const { DUMMY_MODEL, EXPECTED_VALIDATION_ERRORS, EXPECTED_VALIDATION_SUCCESSES, validateModel } = Model;

  describe('Document validation', () => {
    it.each(EXPECTED_VALIDATION_SUCCESSES)('should accept valid dummy model: [%s]', async (validKeys) => {
      const validModelObject = {
        ...DUMMY_MODEL,
        ...validKeys,
      };
      const result = await validateModel(validModelObject).catch((err) => err);
      expect(result).toBe(validModelObject);
    });

    it.each(EXPECTED_VALIDATION_ERRORS)('should reject invalid dummy model: [%s]', async (invalidKeys, expectedError) => {
      const invalidModelObject = {
        ...DUMMY_MODEL,
        ...invalidKeys,
      };
      const result = await validateModel(invalidModelObject).catch((err) => err);
      expect(expectedError).toBeTruthy();
      expect(result).toBe(expectedError);
    });
  });
});

describe.each(MODELS)('%s mongoose model', (modelName, Model) => {
  const { DUMMY_MODEL, RECORD_ID_KEY, MODIFY_SAFE_KEY, MongooseModel } = Model;

  describe('Model file export', () => {
    it('should export expected values and methods', async () => {
      expect(Model).toHaveProperty('RECORD_ID_KEY');
      expect(Model).toHaveProperty('MODEL_KEY');
      expect(Model).toHaveProperty('MongooseModel');
      expect(Model).toHaveProperty('JOI_SCHEMA');
      expect(Model).toHaveProperty('validateModel');
    });
  });

  describe('Document creation', () => {
    let NewlyCreatedDocument;

    it('should create new document in database', async () => {
      const DocumentToCreate = Object.assign({}, DUMMY_MODEL);
      const createdModel = await createModelInDatabase(MongooseModel, RECORD_ID_KEY, DocumentToCreate, {
        _id: RECORD_ID_KEY === '_id',
      });
      NewlyCreatedDocument = Object.assign({}, createdModel);
      delete createdModel._id;
      expect(createdModel).toEqual(DocumentToCreate);
    });

    it('should find new document in database', async () => {
      const query = { [RECORD_ID_KEY]: NewlyCreatedDocument[RECORD_ID_KEY] };
      const modelRecord = await findOneModelInDatabase(MongooseModel, query, { _id: RECORD_ID_KEY === '_id' });
      expect(modelRecord).toEqual(NewlyCreatedDocument);
    });

    it('should return document and handle conditional timestamp fields', async () => {
      const query = { [RECORD_ID_KEY]: NewlyCreatedDocument[RECORD_ID_KEY] };
      const options = { timestamps: true, _id: RECORD_ID_KEY === '_id' };
      const modelRecord = await findOneModelInDatabase(MongooseModel, query, options);
      expect(modelRecord).toHaveProperty('createdAt');
      expect(modelRecord).toHaveProperty('updatedAt');
    });

    it('should return document and handle conditional id field', async () => {
      const query = { [RECORD_ID_KEY]: NewlyCreatedDocument[RECORD_ID_KEY] };
      const options = { _id: true };
      const modelRecord = await findOneModelInDatabase(MongooseModel, query, options);
      expect(modelRecord).toHaveProperty('_id');
    });
  });

  describe('Document updating', () => {
    let DocumentToBeUpdated;
    beforeAll(async () => {
      const NewDocument = Object.assign({}, DUMMY_MODEL);
      const createdModel = await createModelInDatabase(MongooseModel, RECORD_ID_KEY, NewDocument, {
        _id: RECORD_ID_KEY === '_id',
      });
      DocumentToBeUpdated = createdModel;
    });

    afterEach((done) => {
      MongooseModel.deleteMany({}, (err, response) => {
        done();
      });
    });

    it('should modify and return updated document', async () => {
      // Update a record
      const NEW_MOCK_ID_VALUE = 'yeet';
      const ExpectedUpdatedModel = Object.assign({}, DocumentToBeUpdated);
      ExpectedUpdatedModel[MODIFY_SAFE_KEY] = NEW_MOCK_ID_VALUE;
      const query = { [RECORD_ID_KEY]: DocumentToBeUpdated[RECORD_ID_KEY] };
      await updateModelInDatabase(MongooseModel, ExpectedUpdatedModel, query);

      // Find updated record
      const updatedQuery = { [MODIFY_SAFE_KEY]: NEW_MOCK_ID_VALUE };
      const actualUpdatedModel = await findOneModelInDatabase(MongooseModel, updatedQuery, {
        _id: RECORD_ID_KEY === '_id',
      });
      expect(actualUpdatedModel).toHaveProperty(MODIFY_SAFE_KEY, NEW_MOCK_ID_VALUE);
      expect(actualUpdatedModel).not.toHaveProperty(MODIFY_SAFE_KEY, DUMMY_MODEL[RECORD_ID_KEY]);
    });

    it('should not update fake document', async () => {
      const query = { [MODIFY_SAFE_KEY]: 'fakeId' };
      const updateResult = await updateModelInDatabase(MongooseModel, DUMMY_MODEL, query);
      expect(updateResult).toBeFalsy();
    });
  });

  describe('Document deletion', () => {
    let DocumentToBeDeleted;
    let DocDeletedId;
    beforeEach(async () => {
      const NewDocument = Object.assign({}, DUMMY_MODEL);
      const createdModel = await createModelInDatabase(MongooseModel, RECORD_ID_KEY, NewDocument, { _id: true });
      DocDeletedId = createdModel._id;
      delete createdModel._id;
      DocumentToBeDeleted = createdModel;
    });

    afterEach((done) => {
      MongooseModel.deleteMany({}, (err, response) => {
        done();
      });
    });

    it('should delete and not find document', async () => {
      const query = { _id: DocDeletedId };
      const modelRecord = await findOneModelInDatabase(MongooseModel, query);
      expect(modelRecord).toEqual(DocumentToBeDeleted);

      const deleteResult = await deleteModelInDatabase(MongooseModel, query);
      expect(deleteResult).toHaveProperty('acknowledged');
      expect(deleteResult).toHaveProperty('deletedCount', 1);

      const missingRecord = await findOneModelInDatabase(MongooseModel, query);
      expect(missingRecord).toBeFalsy();
    });

    it('should not delete fake document from random string', async () => {
      const query = { _id: 'random' };

      const deleteResult = await deleteModelInDatabase(MongooseModel, query);
      expect(deleteResult).toHaveProperty('acknowledged');
      expect(deleteResult).toHaveProperty('deletedCount', 0);
    });

    it('should not delete fake document from random uuid', async () => {
      const query = { _id: uuid() };

      const deleteResult = await deleteModelInDatabase(MongooseModel, query);
      expect(deleteResult).toHaveProperty('acknowledged');
      expect(deleteResult).toHaveProperty('deletedCount', 0);
    });
  });
});
