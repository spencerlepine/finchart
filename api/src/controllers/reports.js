const { ReportMetadata, Spreadsheet } = require('../models');
const {
  generateInitSpreadsheetDocs,
  parseEntireReportJSONImport,
  formatImportedReportSpreadsheets,
} = require('../utils/reportUtils');
const ReportMetadataMongoose = ReportMetadata.MongooseModel;
const SpreadsheetMongoose = Spreadsheet.MongooseModel;

const { updateModelInDatabase, findOneModelInDatabase, createModelInDatabase, insertManyInDatabase } = require('../models');

module.exports.createUserReport = (req, res) => {
  createModelInDatabase(ReportMetadataMongoose, ReportMetadata.RECORD_ID_KEY, req.body, { _id: true })
    .then((metadataResult) =>
      insertManyInDatabase(SpreadsheetMongoose, generateInitSpreadsheetDocs(req.params.userId, metadataResult._id)).then(
        () => metadataResult
      )
    )
    .then((metadataResult) => res.status(201).json(metadataResult))
    .catch((err) => res.status(400).json({ error: 'Unable to create report in the Database', stack: err }));
};

module.exports.deleteUserReports = (req, res) => {
  ReportMetadataMongoose.findOneAndDelete({
    _id: req.params.reportId,
    userId: req.params.userId,
  })
    .then((result) =>
      SpreadsheetMongoose.deleteMany({
        reportId: req.params.reportId,
        userId: req.params.userId,
      })
    )
    .then((result) => {
      res.status(204).json({ message: 'Successfully deleted report' });
    })
    .catch((err) => res.status(400).json({ error: 'Unable to delete entire report from the Database', stack: err }));
};

module.exports.getUserReports = (req, res) => {
  const query = { userId: req.params.userId };
  ReportMetadataMongoose.find(query)
    .then((result) => res.json(result.map((doc) => ({ ...doc.toObject(), id: doc._id }))))
    .catch((err) => res.status(400).json({ error: 'Unable to find report in the Database' }));
};

module.exports.getUserReport = (req, res) => {
  const query = { _id: req.params.reportId, userId: req.params.userId };
  ReportMetadataMongoose.findOne(query)
    .then((result) => {
      res.json({ ...result.toObject(), id: result._id });
    })
    .catch((err) => res.status(400).json({ error: 'Unable to find user report in the Database', stack: err }));
};

module.exports.updateUserReport = (req, res) => {
  const UpdatedMetadataDoc = {
    ...req.body,
    userId: req.params.userId,
  };

  ReportMetadataMongoose.findByIdAndUpdate(req.params.reportId, UpdatedMetadataDoc)
    .then(() => res.json({ msg: 'Updated successfully' }))
    .catch((err) => res.status(400).json({ error: 'Unable to update the Database' }));
};

module.exports.exportOneUserReport = (req, res) => {
  const { reportId, userId } = req.params;

  const query = { _id: reportId, userId: userId };
  ReportMetadataMongoose.findOne(query)
    .then((metadataDocument) => {
      return SpreadsheetMongoose.find({ reportId, userId }).then((reportSpreadsheetDocs) => {
        const spreadsheets = [];
        reportSpreadsheetDocs.forEach((doc) => {
          const formattedSpreadsheetDoc = { ...doc.toObject(), id: doc._id };
          delete formattedSpreadsheetDoc['createdAt'];
          delete formattedSpreadsheetDoc['updatedAt'];
          delete formattedSpreadsheetDoc['_id'];
          delete formattedSpreadsheetDoc['__v'];
          spreadsheets.push(formattedSpreadsheetDoc);
        });
        const formattedReportDoc = {
          ...metadataDocument.toObject(),
          id: metadataDocument._id,
          spreadsheets,
          repository: 'https://github.com/spencerlepine/finchart',
        };
        delete formattedReportDoc['_id'];
        delete formattedReportDoc['__v'];
        return formattedReportDoc;
      });
    })
    .then((formatedReportExport) => res.json(formatedReportExport))
    .catch((err) => res.status(400).json({ error: 'Unable to generate report export from the Database', stack: err }));
};

module.exports.importOneUserReport = (req, res) => {
  let parsedReportImport;
  try {
    parsedReportImport = parseEntireReportJSONImport(req.body, req.params.userId);
  } catch (e) {
    res.status(400).json({ error: 'Unable to parse import JSON' });
  }

  if (parsedReportImport) {
    let newReportId;
    createModelInDatabase(ReportMetadataMongoose, ReportMetadata.RECORD_ID_KEY, parsedReportImport, { _id: true })
      .then((createResult) => {
        newReportId = createResult._id;
        delete createResult.pages;
        delete createResult.spreadsheets;
        try {
          const newSpreadsheetDocs = formatImportedReportSpreadsheets(
            req.body.spreadsheets || req.body.pages,
            req.params.userId,
            newReportId
          );
          return SpreadsheetMongoose.insertMany(newSpreadsheetDocs);
        } catch (e) {
          res.status(400).json({ error: 'Unable to generate spreadsheets in Database' });
        }
      })
      .then(() => res.status(201).json({ id: newReportId }))
      .catch((err) => {
        console.error(err);
        res.status(400).json({ error: 'Unable to generate report in Database', stack: `${err}` });
      });
  } else {
    res.status(400).json({ error: 'Unable to import report into Database' });
  }
};

module.exports.getLatestUserReport = (req, res) => {
  const query = { userId: req.params.userId };
  ReportMetadataMongoose.find(query, { sort: { createdAt: 1 } })
    .then((result) => {
      const latestReportDocument = result[0];
      return ReportMetadataMongoose.findOne({ _id: latestReportDocument._id }).then((d) => res.json(d.toObject()));
    })
    .catch((err) => res.status(400).json({ error: 'Unable to find report in the Database' }));
};
