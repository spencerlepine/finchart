import React, { useState, useEffect } from 'react';
import { Box, Paper, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { fetchLatestReport } from '../api/reports';
import TableEditor from './TableEditor';

import config from '../config';

const { INITIAL_FORM_PAGE_ID } = config;

const ReportSnapshotWidget = () => {
  const [loading, setLoading] = useState(false);
  const [latestReport, setLatestReport] = useState({});

  const loadLatestReports = () => {
    setLoading(true);
    void fetchLatestReport()
      .then((latestReportFound) => {
        setLatestReport(latestReportFound);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLatestReports();
  }, []);

  if (loading) {
    return (
      <div>
        <AiOutlineLoading3Quarters /> <p>Fetching reports...</p>
      </div>
    );
  }

  return (
    <Box sx={{ mt: 5 }} justifyContent="center" alignItems="center" display="flex-inline">
      <Toolbar>
        <h4>
          <strong>Latest Snapshot:</strong> {latestReport.title} [
          <Link to={`/reports/${latestReport._id}/${INITIAL_FORM_PAGE_ID}`}>Edit</Link>]
        </h4>
      </Toolbar>

      <Paper>
        {latestReport.spreadsheets &&
          latestReport.spreadsheets.map &&
          latestReport.spreadsheets.map((spreadsheet) => (
            <TableEditor
              formPageId={spreadsheet.formPageId}
              reportId={spreadsheet._id}
              isReadOnly={true}
              setPageLoading={setLoading}
              initialSpreadsheetConfig={spreadsheet}
            />
          ))}
      </Paper>
    </Box>
  );
};

export default ReportSnapshotWidget;
