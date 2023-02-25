const FORM_PAGE_ID_KEYS = {
  INCOME: 'income',
  TAXES: 'taxes',
  SPENDING: 'spending',
  INVESTING: 'investing',
  SAVINGS: 'savings',
  CASH: 'cash',
  ASSETS: 'assets',
  LIABILITES: 'liabilites',
  GOALS: 'goals',
  CREDIT_CARDS: 'credit-cards',
};

const FORM_NAME_FROM_ID = {
  [FORM_PAGE_ID_KEYS.INCOME]: 'Income',
  [FORM_PAGE_ID_KEYS.TAXES]: 'Taxes',
  [FORM_PAGE_ID_KEYS.SPENDING]: 'Spending',
  [FORM_PAGE_ID_KEYS.INVESTING]: 'Investing',
  [FORM_PAGE_ID_KEYS.SAVINGS]: 'Savings',
  [FORM_PAGE_ID_KEYS.CASH]: 'Cash',
  [FORM_PAGE_ID_KEYS.ASSETS]: 'Assets',
  [FORM_PAGE_ID_KEYS.LIABILITES]: 'Liabilites',
  [FORM_PAGE_ID_KEYS.GOALS]: 'Goals',
  [FORM_PAGE_ID_KEYS.CREDIT_CARDS]: 'Credit Cards',
};

const optionalColumns = [
  {
    key: 'comment',
    title: 'Comment',
    dataType: 'string',
    optional: true,
  },
];

const FormPagesConfig = {
  [FORM_PAGE_ID_KEYS.INCOME]: {
    formPageId: FORM_PAGE_ID_KEYS.INCOME,
    prevFormPageId: null,
    nextFormPageId: FORM_PAGE_ID_KEYS.TAXES,
    columnSumKeys: [
      {
        key: 'monthly-gross',
      },
    ],
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'monthly-gross',
        title: 'Monthly Gross',
        dataType: 'number',
      },
      {
        key: 'monthly-net',
        title: 'Monthly Net',
        dataType: 'number',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.TAXES]: {
    formPageId: FORM_PAGE_ID_KEYS.TAXES,
    prevFormPageId: FORM_PAGE_ID_KEYS.INCOME,
    nextFormPageId: FORM_PAGE_ID_KEYS.SPENDING,
    columnSumKeys: [
      {
        key: 'monthly-tax',
        isNegative: true,
      },
    ],
    columns: [
      {
        key: 'category',
        title: 'Category',
        dataType: 'string',
      },
      {
        key: 'monthly-tax',
        title: 'Monthly Tax',
        dataType: 'number',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.SPENDING]: {
    formPageId: FORM_PAGE_ID_KEYS.SPENDING,
    prevFormPageId: FORM_PAGE_ID_KEYS.TAXES,
    nextFormPageId: FORM_PAGE_ID_KEYS.INVESTING,
    columnSumKeys: [
      {
        key: 'monthly-budget',
        isNegative: true,
      },
    ],
    columns: [
      {
        key: 'category',
        title: 'Category',
        dataType: 'string',
      },
      {
        key: 'monthly-budget',
        title: 'Monthly Budget',
        dataType: 'number',
      },
      {
        key: 'item',
        title: 'Item',
        dataType: 'string',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.INVESTING]: {
    formPageId: FORM_PAGE_ID_KEYS.INVESTING,
    prevFormPageId: FORM_PAGE_ID_KEYS.SPENDING,
    nextFormPageId: FORM_PAGE_ID_KEYS.SAVINGS,
    columnSumKeys: [
      {
        key: 'monthly-amount',
      },
    ],
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'monthly-amount',
        title: 'Monthly Amount',
        dataType: 'string',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.SAVINGS]: {
    formPageId: FORM_PAGE_ID_KEYS.SAVINGS,
    prevFormPageId: FORM_PAGE_ID_KEYS.INVESTING,
    nextFormPageId: FORM_PAGE_ID_KEYS.CASH,
    columnSumKeys: [
      {
        key: 'monthly-amount',
      },
    ],
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'monthly-amount',
        title: 'Monthly Amount',
        dataType: 'number',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.CASH]: {
    formPageId: FORM_PAGE_ID_KEYS.CASH,
    prevFormPageId: FORM_PAGE_ID_KEYS.SAVINGS,
    nextFormPageId: FORM_PAGE_ID_KEYS.ASSETS,
    columnSumKeys: [
      {
        key: 'current-total',
      },
    ],
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'type',
        title: 'Type',
        dataType: 'string',
      },
      {
        key: 'current-total',
        title: 'Current Total',
        dataType: 'number',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.ASSETS]: {
    formPageId: FORM_PAGE_ID_KEYS.ASSETS,
    prevFormPageId: FORM_PAGE_ID_KEYS.CASH,
    nextFormPageId: FORM_PAGE_ID_KEYS.LIABILITES,
    columnSumKeys: [
      {
        key: 'current-value',
      },
      {
        key: 'monthly-income',
      },
    ],
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'type',
        title: 'Type',
        dataType: 'string',
      },
      {
        key: 'category',
        title: 'Category',
        dataType: 'string',
      },
      {
        key: 'monthly-income',
        title: 'Monthly Income',
        dataType: 'number',
      },
      {
        key: 'current-value',
        title: 'Current Value',
        dataType: 'number',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.LIABILITES]: {
    formPageId: FORM_PAGE_ID_KEYS.LIABILITES,
    prevFormPageId: FORM_PAGE_ID_KEYS.ASSETS,
    nextFormPageId: FORM_PAGE_ID_KEYS.GOALS,
    columnSumKeys: [
      {
        isNegative: true,
        key: 'monthly-cost',
      },
      {
        key: 'current-value',
      },
    ],
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'type',
        title: 'Type',
        dataType: 'string',
      },
      {
        key: 'monthly-cost',
        title: 'Monthly Cost',
        dataType: 'number',
      },
      {
        key: 'current-value',
        title: 'Current Value',
        dataType: 'number',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.GOALS]: {
    formPageId: FORM_PAGE_ID_KEYS.GOALS,
    prevFormPageId: FORM_PAGE_ID_KEYS.LIABILITES,
    nextFormPageId: FORM_PAGE_ID_KEYS.CREDIT_CARDS,
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'type',
        title: 'Type',
        dataType: 'string',
      },
      {
        key: 'goal',
        title: 'Goal',
        dataType: 'number',
      },
      {
        key: 'current-amount',
        title: 'Current Amount',
        dataType: 'number',
      },
      {
        key: 'target-date',
        title: 'Target Date',
        dataType: 'string',
      },
      ...optionalColumns,
    ],
  },
  [FORM_PAGE_ID_KEYS.CREDIT_CARDS]: {
    formPageId: FORM_PAGE_ID_KEYS.CREDIT_CARDS,
    prevFormPageId: FORM_PAGE_ID_KEYS.GOALS,
    nextFormPageId: null,
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataType: 'string',
      },
      {
        key: 'type',
        title: 'Type',
        dataType: 'string',
      },
      {
        key: 'date-opened',
        title: 'Current Value',
        dataType: 'string',
      },
      ...optionalColumns,
    ],
  },
};

const possibleColumnKeys = new Set();
Object.values(FormPagesConfig).map(({ columns }) =>
  columns.forEach((columnConfig) => possibleColumnKeys.add(columnConfig.key))
);
module.exports.POSSIBLE_COLUMN_KEYS = Array.from(possibleColumnKeys);
module.exports.FORM_PAGE_IDS = Object.values(FORM_PAGE_ID_KEYS);
module.exports.FORM_PAGE_ID_KEYS = FORM_PAGE_ID_KEYS;
module.exports.FORM_NAME_FROM_ID = FORM_NAME_FROM_ID;
module.exports.FormPagesConfig = FormPagesConfig;
