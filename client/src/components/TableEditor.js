import React, { useState, useEffect } from 'react';

import { kaReducer, Table } from 'ka-table';
import { loadData, updateData, insertRow, deleteRow } from 'ka-table/actionCreators';
import { SortingMode, EditingMode, InsertRowPosition } from 'ka-table/enums';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Alert, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { updateSpreadsheetData, fetchSpreadsheetData } from '../api/forms';

const tablePropsInit = {
  columns: [],
  singleAction: loadData(),
  editingMode: EditingMode.Cell,
  sortingMode: SortingMode.Single,
  rowKeyField: 'id',
};

const pageConfigInit = {
  name: 'Error',
  columns: [],
  output: {},
  tip: '',
  data: [],
};

const DeleteRowBtn = ({ dispatch, rowKeyValue }) => {
  const handleRowDelete = () => {
    if (window.confirm('Delete this row?')) {
      dispatch(deleteRow(rowKeyValue));
    }
  };

  return (
    <img
      src="https://komarovalexander.github.io/ka-table/static/icons/delete.svg"
      className="delete-row-column-button"
      onClick={handleRowDelete}
      alt="Delete Row"
    />
  );
};

/*
 * Spreadsheet-like editor component built with => ka-table@^7.8.3
 * Loads column header configuration from server
 * Fetches/updates row data with user input
 */
const TableEditor = (props) => {
  const { formPageId, reportId, initialSpreadsheetConfig, isReadOnly } = props;

  const [loading, setLoading] = useState(false);
  const [tableProps, changeTableProps] = useState({ ...tablePropsInit, ...initialSpreadsheetConfig });
  const [pageConfig, setPageConfig] = useState(pageConfigInit);

  const loadSpreadsheetTableData = (callback) => {
    setLoading(true);

    void fetchSpreadsheetData(reportId, formPageId)
      .then((spreadsheet) => {
        callback(spreadsheet.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadSpreadsheetConfig = (callback) => {
    setLoading(true);

    if (isReadOnly) {
      return callback(initialSpreadsheetConfig);
    }

    void fetchSpreadsheetData(reportId, formPageId)
      .then((spreadsheetConfig) => {
        callback(spreadsheetConfig);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const updatePageTableData = (newData, callback) => {
    setLoading(true);

    void updateSpreadsheetData(reportId, formPageId, newData)
      .then((updatedSpreadsheet) => {
        callback(updatedSpreadsheet);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleFormStateChange = (rowId, columnKey, value) => {
    const newData = (tableProps.data || []).map((row) => (row.id === rowId ? { ...row, [columnKey]: value } : row));
    updatePageTableData(newData, () => {});
  };

  const initFormTableState = () => {
    loadSpreadsheetTableData((pageData) => {
      dispatch(updateData(pageData));
    });

    loadSpreadsheetConfig((pageConfig) => {
      const columnsWithDeleteBtn = [...(pageConfig.columns || [])];
      if (!isReadOnly && !columnsWithDeleteBtn.some(({ key }) => key === ':delete')) {
        columnsWithDeleteBtn.push({ key: ':delete', width: 70, style: { textAlign: 'center' } });
      }
      pageConfig.columns = columnsWithDeleteBtn;

      setPageConfig(pageConfig);

      changeTableProps((prevState) => ({
        ...prevState,
        columns: pageConfig.columns,
      }));
    });
  };

  useEffect(() => {
    initFormTableState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPageId]);

  const dispatch = async (action) => {
    changeTableProps((prevState) => kaReducer(prevState, action));
    setLoading(false);

    if (action.type === 'UpdateCellValue') {
      handleFormStateChange(action.rowKeyValue, action.columnKey, action.value);
    }

    // if event is config update
    // handleFormConfigChange();
  };

  const handleRowInsertBottom = () => {
    const newId = (tableProps.data || []).length + 1;
    const newRow = { id: newId };
    const { columns } = pageConfig;
    for (const columnConfig of columns) {
      const { key } = columnConfig;
      newRow[key] = '';
    }
    dispatch(insertRow(newRow, { rowKeyValue: newId, insertRowPosition: InsertRowPosition.after }));
  };

  if (loading) {
    return (
      <div>
        <AiOutlineLoading3Quarters /> <p>Fetching reports...</p>
      </div>
    );
  } else if (!pageConfig) {
    return <p>Unable to load table</p>;
  }

  return (
    <div className="remote-data-demo">
      <Toolbar>
        <Typography variant="h5" color="inherit" mr={2}>
          {pageConfig.name || pageConfig.formPageId}
        </Typography>

        {pageConfig.tip && <Alert severity="info">{pageConfig.tip}</Alert>}

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ marginLeft: 'auto' }}>
            <Button size="small" contained="true" variant="contained" onClick={handleRowInsertBottom} color="info">
              Insert Row
            </Button>
          </Box>
        )}
      </Toolbar>

      <Table
        childComponents={{
          cellText: {
            content: (props) => {
              switch (props.column.key) {
                case ':delete':
                  return <DeleteRowBtn {...props} />;
                default:
                  break;
              }
            },
          },
        }}
        {...tableProps}
        editingMode={isReadOnly ? EditingMode.None : EditingMode.Cell}
        dispatch={dispatch}
      />
    </div>
  );
};

export default TableEditor;
