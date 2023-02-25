// FinChart Specific Business logic
const { FormPagesConfig, FORM_NAME_FROM_ID } = require('../config/FormPagesConfig');
const { v4: uuid } = require('uuid');

const getDefaultSpreadsheetConfig = (formPageId) => {
  return FormPagesConfig[formPageId] || {};
};
exports.getDefaultSpreadsheetConfig = getDefaultSpreadsheetConfig;

const formatImportedReportSpreadsheets = (importedPages = [], userId, reportId) => {
  const NewSpreadsheetsData = [];

  const incomingSpreadsheets = {};
  importedPages.forEach((page) => (incomingSpreadsheets[page.formPageId] = page));

  // Verify all incoming pages are present
  const EXPECTED_SPREADSHEETS = Object.keys(FormPagesConfig);
  for (const formPageId of EXPECTED_SPREADSHEETS) {
    // Verify the page exists
    if (incomingSpreadsheets[formPageId] === undefined) {
      throw Error(`MISSING SPREADSHEET: ${formPageId} [finchart@1.0.0]`);
    }

    // Generate spreadsheet doc
    const formDefaultConfig = FormPagesConfig[formPageId];

    const NewSpreadsheetObj = {
      ...formDefaultConfig,
      _id: uuid(),
      userId,
      reportId,
      name: FORM_NAME_FROM_ID[formPageId],
      data: (incomingSpreadsheets[formPageId].data || []).map((rowData, i) => ({ ...rowData, id: i + 1 })),
    };

    const PAGE_COLUMNS = NewSpreadsheetObj.columns;
    const PAGE_EXPECTED_COLUMNS = FormPagesConfig[formPageId].columnSumKeys || [];
    for (const expectedColumn of PAGE_EXPECTED_COLUMNS) {
      // Garruntee the table config has minimum expected columns
      if (PAGE_COLUMNS.some((importedColumn) => importedColumn.key === expectedColumn.key) === false) {
        throw Error(`MISSING COLUMN: ${expectedColumn.key} (on ${formPageId}) [finchart@1.0.0]`);
      }

      // Garruntee every table row has the expected columns
      const PAGE_ROWS_DATA = incomingSpreadsheets[formPageId].data;
      for (const row of PAGE_ROWS_DATA) {
        if (row[expectedColumn.key] === undefined) {
          throw Error(`MISSING ROW KEY: ${expectedColumn.key} (on ${formPageId}) [finchart@1.0.0] - ${JSON.stringify(row)}`);
        }
      }
    }

    // Save formatted document to list
    NewSpreadsheetsData.push(NewSpreadsheetObj);
  }

  return NewSpreadsheetsData;
};
exports.formatImportedReportSpreadsheets = formatImportedReportSpreadsheets;

const parseEntireReportJSONImport = (reportJSON, userId) => {
  if (reportJSON.version === '1.0.0') {
    const newMetadataDoc = {
      userId: userId,
      title: reportJSON.title || 'New Report',
      status: 'draft',
      notes: reportJSON.notes,
      version: reportJSON.version,
      spreadsheets: formatImportedReportSpreadsheets(reportJSON.spreadsheets || reportJSON.pages),
    };
    return newMetadataDoc;
  }
};
exports.parseEntireReportJSONImport = parseEntireReportJSONImport;

const makeTitle = (slug) => {
  const words = slug.split('-');

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');
};

const generateInitSpreadsheetDocs = (userId, reportId) => {
  const NewSpreadsheetsData = [];

  Object.values(FormPagesConfig).forEach((formDefaultConfig) => {
    const NewSpreadsheetObj = {
      ...formDefaultConfig,
      _id: uuid(),
      name: makeTitle(formDefaultConfig.formPageId),
      userId: userId,
      reportId: reportId,
      data: [], // empty columns to start, or placeholders
    };

    NewSpreadsheetsData.push(NewSpreadsheetObj);
  });

  return NewSpreadsheetsData;
};

exports.generateInitSpreadsheetDocs = generateInitSpreadsheetDocs;
