import React from 'react';
import { Box, Toolbar, Button } from '@mui/material';
import ReportSnapshotWidget from './ReportSnapshotWidget';
import { createNewReport } from '../api/reports';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const handleCreateNewReport = () => {
    const newReportTitle = window.prompt('What should this report title be?');
    if (newReportTitle) {
      createNewReport(newReportTitle).catch((err) => {
        window.alert('Unable to create report');
        console.error(err);
      });
    }
  };

  return (
    <Box maxWidth="md">
      <Toolbar>
        <Button to="/reports" component={Link} color="info" variant="contained" size="medium">
          View Reports
        </Button>
        <Button color="success" variant="contained" size="medium" onClick={handleCreateNewReport}>
          Start New Report
        </Button>
      </Toolbar>

      <ReportSnapshotWidget />
    </Box>
  );
};

export default Dashboard;
