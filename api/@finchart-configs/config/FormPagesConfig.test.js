// FinChart Specific Business logic
const FormPagesConfig = require('./FormPagesConfig');
const {
  formatImportedReportSpreadsheets,
  parseEntireReportJSONImport,
  getDefaultSpreadsheetConfig,
} = require('../../src/utils/reportUtils');
const DUMMY_REPORTS = require('../testHelpers/dummyReports');

describe('FinChart Form v1.0.0', () => {
  describe('Spreadsheet Configurations', () => {
    it('should export list of valid form page id strings', () => {
      const validFormPageIds = FormPagesConfig.FORM_PAGE_IDS;
      expect(Array.isArray(validFormPageIds)).toBeTruthy();
    });

    it('should export schema for every form page', () => {
      const formPagesConfiguration = FormPagesConfig.FormPagesConfig;
      expect(typeof formPagesConfiguration === 'object' && !Array.isArray(formPagesConfiguration)).toBeTruthy();

      FormPagesConfig.FORM_PAGE_IDS.forEach((formPageId) => {
        expect(formPagesConfiguration).toHaveProperty(formPageId);
        const thisPageConfig = formPagesConfiguration[formPageId];
        expect(thisPageConfig).toHaveProperty('formPageId');
        expect(thisPageConfig).toHaveProperty('prevFormPageId');
        expect(thisPageConfig).toHaveProperty('nextFormPageId');
        expect(thisPageConfig).toHaveProperty('columns');

        if (thisPageConfig.columnSumKeys !== undefined) {
          thisPageConfig.columnSumKeys.forEach((columnSumConfig) => {
            expect(columnSumConfig).toHaveProperty('key');
            if (columnSumConfig.isNegative !== undefined) {
              expect(typeof columnSumConfig.isNegative).toBe('boolean');
            }
          });
        }
      });
    });
  });

  describe('Form Configuration', () => {
    it('should define expected spreadsheets', () => {
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('income');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('taxes');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('spending');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('investing');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('savings');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('cash');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('assets');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('liabilites');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('goals');
      expect(FormPagesConfig.FormPagesConfig).toHaveProperty('credit-cards');
    });

    it.each([
      ['income', [{ key: 'monthly-gross' }]],
      ['taxes', [{ isNegative: true, key: 'monthly-tax' }]],
      ['spending', [{ isNegative: true, key: 'monthly-budget' }]],
      ['investing', [{ key: 'monthly-amount' }]],
      ['savings', [{ key: 'monthly-amount' }]],
      ['cash', [{ key: 'current-total' }]],
      ['assets', [{ key: 'current-value' }, { key: 'monthly-income' }]],
      [
        'liabilites',
        [
          {
            isNegative: true,
            key: 'monthly-cost',
          },
          {
            key: 'current-value',
          },
        ],
      ],
    ])('should define expected column sum keys: %s', (pageConfigKey, expectedColumnKeys) => {
      const pageConfig = FormPagesConfig.FormPagesConfig[pageConfigKey];
      expect(pageConfig).toHaveProperty('columnSumKeys');
      expect(pageConfig.columnSumKeys).toEqual(expectedColumnKeys);
    });
  });

  describe('Form Importing Helpers', () => {
    const MOCK_REPORT = DUMMY_REPORTS.VALID.EMPTY_DATA_REPORT;
    const MOCK_USER_ID = 'testUser123';
    const MOCK_REPORT_ID = 'asdfasfdasdf';

    it('should parse valid spreadsheet list', () => {
      const PARSED_IMPORTED_SPREADSHEETS = formatImportedReportSpreadsheets(
        MOCK_REPORT.spreadsheets,
        MOCK_USER_ID,
        MOCK_REPORT_ID
      );
      expect(PARSED_IMPORTED_SPREADSHEETS).toBeDefined();
      PARSED_IMPORTED_SPREADSHEETS.forEach((spreadsheetObject) => {
        expect(spreadsheetObject).toHaveProperty('_id');
        expect(spreadsheetObject).toHaveProperty('formPageId');
        expect(spreadsheetObject).toHaveProperty('prevFormPageId');
        expect(spreadsheetObject).toHaveProperty('nextFormPageId');
        expect(spreadsheetObject).toHaveProperty('columns');
        expect(spreadsheetObject).toHaveProperty('data');
      });
    });

    it.each([
      ['MissingPage', DUMMY_REPORTS.INVALID.MISSING_PAGE],
      ['MissingRowData', DUMMY_REPORTS.INVALID.MISSING_ROW_DATA],
      ['OneInvalidTableRow', DUMMY_REPORTS.TRANSFORMABLE.ONE_INVALID_TABLE_ROW],
    ])('should not parse invalid spreadsheet list - %s', (invalidReason, invalidJSON) => {
      expect(() => formatImportedReportSpreadsheets(invalidJSON.spreadsheets, MOCK_USER_ID, MOCK_REPORT_ID)).toThrowError();
    });

    it.each([
      ['MissingNotes', DUMMY_REPORTS.TRANSFORMABLE.MISSING_NOTES],
      ['MissingTitle', DUMMY_REPORTS.TRANSFORMABLE.MISSING_TITLE],
      ['InvalidNotes', DUMMY_REPORTS.TRANSFORMABLE.INVALID_NOTES],
      ['MissingStatus', DUMMY_REPORTS.TRANSFORMABLE.MISSING_STATUS],
    ])('should transform valid JSON file import - %s', (invalidReason, invalidJSON) => {
      const PARSED_REPORT_IMPORT = parseEntireReportJSONImport(invalidJSON, MOCK_USER_ID);
      expect(PARSED_REPORT_IMPORT).toBeDefined();
      expect(PARSED_REPORT_IMPORT).toHaveProperty('title');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('version');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('status');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('spreadsheets');
    });

    it.each([
      ['LegacyPagesKey', DUMMY_REPORTS.TRANSFORMABLE.LEGACY_PAGES_KEY],
      ['MissingColumnSumKeys', DUMMY_REPORTS.TRANSFORMABLE.MISSING_COLUMN_SUM_KEYS],
      ['MissingPrevNextKeys', DUMMY_REPORTS.TRANSFORMABLE.MISSING_PREV_NEXT_KEYS],
      ['MissingColumnConfigs', DUMMY_REPORTS.TRANSFORMABLE.MISSING_COLUMN_CONFIGS],
      ['PageMissingTip', DUMMY_REPORTS.TRANSFORMABLE.PAGE_MISSING_TIP],
      ['PageMissingName', DUMMY_REPORTS.TRANSFORMABLE.PAGE_MISSING_NAME],
      ['InvalidRowIdKeys', DUMMY_REPORTS.TRANSFORMABLE.INVALID_ROW_ID_KEYS],
    ])('should transform valid spreadsheet JSON file imports - %s', (invalidReason, invalidJSON) => {
      const PARSED_REPORT_IMPORT = parseEntireReportJSONImport(invalidJSON, MOCK_USER_ID);
      expect(PARSED_REPORT_IMPORT).toBeDefined();
      expect(PARSED_REPORT_IMPORT).toHaveProperty('title');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('version');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('status');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('spreadsheets');
      const { spreadsheets } = PARSED_REPORT_IMPORT;
      spreadsheets.forEach((spreadsheetData) => {
        expect(spreadsheetData).toHaveProperty('formPageId');
        const formConfig = getDefaultSpreadsheetConfig(spreadsheetData.formPageId);

        if (formConfig.columnSumKeys !== undefined) {
          expect(spreadsheetData.columnSumKeys).toEqual(formConfig.columnSumKeys);
        }

        expect(spreadsheetData.prevFormPageId).toEqual(formConfig.prevFormPageId);
        expect(spreadsheetData.nextFormPageId).toEqual(formConfig.nextFormPageId);

        expect(spreadsheetData.tip).toEqual(formConfig.tip);
        expect(spreadsheetData.name).toEqual(FormPagesConfig.FORM_NAME_FROM_ID[spreadsheetData.formPageId]);
        expect(spreadsheetData.name).toBeTruthy();

        expect(spreadsheetData).toHaveProperty('data');
        const { data } = spreadsheetData;
        expect(Array.isArray(data)).toBeTruthy();
        const rowIdValues = data.map((cellRowObject) => cellRowObject.id);
        rowIdValues.forEach((id, index) => {
          expect(id).toBe(index + 1);
        });
      });
    });

    it.each(['0', 'v1', '1.0.1', 'v1.0.0', '2.0.0', '0.0.1', 1, [], {}, null])(
      'should ignore unsupported semver version JSON file',
      (invalidVersion) => {
        const VALID_DUMMY = DUMMY_REPORTS.VALID.EMPTY_DATA_REPORT;
        const PARSED_REPORT_IMPORT = parseEntireReportJSONImport({ ...VALID_DUMMY, version: invalidVersion }, MOCK_USER_ID);
        expect(PARSED_REPORT_IMPORT).not.toBeDefined();
      }
    );

    it.each([
      ['ValidEmptyTables', DUMMY_REPORTS.VALID.EMPTY_DATA_REPORT],
      ['NormalRowTables', DUMMY_REPORTS.VALID.NORMAL_DATA_REPORT],
      ['ValidExtraKeys', DUMMY_REPORTS.VALID.EXTRA_KEYS_REPORT],
    ])('should handle valid form JSON file import - %s', (invalidReason, invalidJSON) => {
      const PARSED_REPORT_IMPORT = parseEntireReportJSONImport(invalidJSON, MOCK_USER_ID);
      expect(PARSED_REPORT_IMPORT).toBeDefined();
      expect(PARSED_REPORT_IMPORT).toHaveProperty('title');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('version');
      expect(PARSED_REPORT_IMPORT).toHaveProperty('status');
      expect(PARSED_REPORT_IMPORT).not.toHaveProperty('yeet');
    });
  });
});
