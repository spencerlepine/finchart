const { Spreadsheet } = require('../models');
const { findOneModelInDatabase } = require('../models');
const { getDefaultSpreadsheetConfig } = require('../utils/reportUtils');
const SpreadsheetMongoose = Spreadsheet.MongooseModel;

const spreadsheetQuery = (params) => ({
  reportId: params.reportId,
  userId: params.userId,
  formPageId: params.pageId,
});

module.exports.getFormPage = (req, res) => {
  const pageConfigData = getDefaultSpreadsheetConfig(req.params.pageId);

  findOneModelInDatabase(SpreadsheetMongoose, spreadsheetQuery(req.params))
    .then((result) => {
      if (!result)
        return res
          .status(400)
          .json({ error: `Form page does not exist - reportId: ${req.params.reportId}, spreadsheet: ${req.params.pageId}` });

      res.status(200).json({
        ...pageConfigData,
        ...result,
      });
    })
    .catch((err) => res.status(400).json({ error: 'Error retrieving spreadsheet in the Database' }));
};

module.exports.updateFormPage = (req, res) => {
  const pageConfigData = getDefaultSpreadsheetConfig(req.params.pageId);

  const query = spreadsheetQuery(req.params);
  const options = {
    upsert: true,
    $set: {
      data: req.body.data,
    },
  };

  SpreadsheetMongoose.findOneAndUpdate(query, options)
    .then(() => {
      return SpreadsheetMongoose.findOne(query).then((updatedDoc) => {
        return updatedDoc.toObject();
      });
    })
    .then((updatedDocument) =>
      res.json({
        ...pageConfigData,
        ...updatedDocument,
      })
    )
    .catch((err) => {
      res.status(400).json({ error: 'Unable to update form page in the Database', stack: err });
    });
};
