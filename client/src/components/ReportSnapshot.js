import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Paper } from '@mui/material';
import { fetchOneReport, deleteExistingReport, generateReportExport } from '../api/reports';
import moment from 'moment';
import generateReportFileName from '../utils/generateReportFileName';
import TableEditor from './TableEditor';

// TODO
// import staticReportSnapshot from '../__mocks__/fakeReportSnapshot.json';

import config from '../config';
const { INITIAL_FORM_PAGE_ID } = config;

const ReportSnapshot = ({ reportId }) => {
  const [loading, setLoading] = useState(false);
  const [reportSnapshotData, setReportSnapshotData] = useState(null);
  const navigate = useNavigate();

  const loadSnapshotData = () => {
    setLoading(true);

    void fetchOneReport(reportId)
      .then((reportMetadata) => {
        setReportSnapshotData(reportMetadata);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleReportDelete = () => {
    const confirmReportTitle = window.prompt('If you wish to delete this report, type: confirm');
    if (confirmReportTitle === 'confirm') {
      setLoading(true);

      void deleteExistingReport(reportId)
        .then(() => navigate('/reports'))
        .catch((err) => {
          window.alert('Failed to delete report');
          console.error(err);
          setLoading(false);
        });
    }
  };

  const handleReportExport = () => {
    void generateReportExport(reportId)
      .then((reportJSON) => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(reportJSON, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = generateReportFileName(reportJSON.title, new Date(reportJSON.createdAt) || new Date.now());
        link.click();
      })
      .catch((err) => {
        console.error('Unable to export report', err);
        window.alert('Unable to export report');
      });
  };

  const handleReportEdit = () => {
    navigate(`/reports/${reportId}/${INITIAL_FORM_PAGE_ID}`);
  };

  useEffect(() => {
    loadSnapshotData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  if (loading) {
    return (
      <div>
        <AiOutlineLoading3Quarters /> <p>Fetching reports...</p>
      </div>
    );
  } else if (!reportSnapshotData) {
    return <p>Unable to load report</p>;
  }

  return (
    <div>
      <Box display="flex" justifyContent="flex-start" alignItems="flex-start" px={3} my={2}>
        <Button size="medium" variant="contained" contained="true" color="info" to="/reports" component={Link}>
          Back to Reports
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" alignItems="flex-end" px={3} my={2}>
        <Button sx={{ marginRight: '0.5em' }} size="small" variant="contained" color="warning" onClick={handleReportEdit}>
          Edit
        </Button>
        <Button sx={{ marginRight: '0.5em' }} size="small" variant="contained" color="success" onClick={handleReportExport}>
          Export
        </Button>
        <Button sx={{ marginRight: '0.5em' }} size="small" variant="contained" color="error" onClick={handleReportDelete}>
          Delete
        </Button>
      </Box>

      <Box mt={3}>
        <h5>
          {reportSnapshotData.title}{' '}
          <Button size="small" variant="outlined" onClick={loadSnapshotData}>
            Refresh
          </Button>
        </h5>
      </Box>

      <Paper>
        <p>Last Updated: {moment(reportSnapshotData.updatedAt).fromNow()}</p>
        <p>Status: {reportSnapshotData.status}</p>
        {reportSnapshotData.spreadsheets &&
          reportSnapshotData.spreadsheets.map &&
          reportSnapshotData.spreadsheets.map((spreadsheet) => (
            <TableEditor
              formPageId={spreadsheet.formPageId}
              reportId={spreadsheet._id}
              isReadOnly={true}
              setPageLoading={setLoading}
              initialSpreadsheetConfig={spreadsheet}
            />
          ))}
      </Paper>
      {/* <Paper>
        <p>Last Updated: {moment(reportSnapshotData.updatedAt).fromNow()}</p>
        <p>Status: {reportSnapshotData.status}</p>

        <h4>Sankey Diagram</h4>
        <img src={staticReportSnapshot.sankeyImageBase64} width={250} />

        <h4>Income Pie Chart</h4>
        <img src={staticReportSnapshot.incomePiechartImageBase64} width={250} />

        <h4>Spending Pie Chart</h4>
        <img src={staticReportSnapshot.spendingPiechartImageBase64} width={250} />

        <h4>Allocations Pie Chart</h4>
        <img src={staticReportSnapshot.allocationsPiechartImageBase64} width={250} />
      </Paper> */}
    </div>
  );
};

export default ReportSnapshot;
