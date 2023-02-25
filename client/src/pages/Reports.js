import { Button, Toolbar } from '@mui/material';
import React from 'react';
import ReportsList from '../components/ReportsList';
import Layout from '../styles/Layout';
import { createNewReport } from '../api/reports';

const Reports = () => {
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
    <Layout>
      <h3>Reports Dashboard</h3>

      <Toolbar>
        <Button href="/import" color="info" variant="contained" size="medium">
          Import Report
        </Button>
        <Button color="success" variant="contained" size="medium" onClick={handleCreateNewReport}>
          Start New Report
        </Button>
      </Toolbar>

      <ReportsList />
    </Layout>
  );
};

export default Reports;
