const mongoose = require('mongoose');
const joigoose = require('joigoose')(mongoose);

const User = require('./../../@finchart-configs/models/User');
const ReportMetadata = require('./../../@finchart-configs/models/ReportMetadata');
const Spreadsheet = require('./../../@finchart-configs/models/Spreadsheet');
const mongooseSharedMethods = require('./sharedMongoose');

// Export mongoose models and Joi schemas
module.exports = {
  ReportMetadata: {
    ...ReportMetadata,
    MongooseModel: mongoose.model(
      ReportMetadata.MODEL_KEY,
      new mongoose.Schema(joigoose.convert(ReportMetadata.JOI_SCHEMA), { strict: false, timestamps: true })
    ),
  },
  Spreadsheet: {
    ...Spreadsheet,
    MongooseModel: mongoose.model(
      Spreadsheet.MODEL_KEY,
      new mongoose.Schema(joigoose.convert(Spreadsheet.JOI_SCHEMA), { strict: false, timestamps: true })
    ),
  },
  User: {
    ...User,
    MongooseModel: mongoose.model(
      User.MODEL_KEY,
      new mongoose.Schema(joigoose.convert(User.JOI_SCHEMA), { strict: false, timestamps: true })
    ),
  },
  ...mongooseSharedMethods,
};
