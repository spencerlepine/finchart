// FinChart Specific Business logic
exports.INVALID = {
  MISSING_ROW_DATA: require('./invalidReportMissingRowData.json'),
  MISSING_PAGE: require('./invalidReportMissingPage.json'),
  ONE_INVALID_TABLE_ROW: require('./transformableOneInvalidTableRow.json'),
};
exports.VALID = {
  EMPTY_DATA_REPORT: require('./validReportEmptyTables.json'),
  NORMAL_DATA_REPORT: require('./validNormalReportTables.json'),
  EXTRA_KEYS_REPORT: require('./validExtraKeys.json'),
};
exports.TRANSFORMABLE = {
  LEGACY_PAGES_KEY: require('./transformableLegacyPagesKey.json'),
  MISSING_COLUMN_SUM_KEYS: require('./transformableNoColumnSumKeys.json'),
  MISSING_PREV_NEXT_KEYS: require('./transformableMissingPrevNextPageKeys.json'),
  MISSING_COLUMN_CONFIGS: require('./transformablePageNoColumnConfigs.json'),
  MISSING_NOTES: require('./transformableNoNotes.json'),
  INVALID_NOTES: require('./transformableInvalidNotes.json'),
  MISSING_TITLE: require('./transformableNoTitle.json'),
  MISSING_STATUS: require('./transformableNoStatus.json'),
  PAGE_MISSING_TIP: require('./transformableNoPageTip.json'),
  PAGE_MISSING_NAME: require('./transformableNoPageName.json'),
  INVALID_ROW_ID_KEYS: require('./transformableInvalidRowIdKeys.json'),
};
