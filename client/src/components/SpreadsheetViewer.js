import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import TableEditor from './TableEditor';
import config from '../config';
import { fetchSpreadsheetData } from '../api/forms';
import { updateReportMetadata } from '../api/reports';

import { Box } from '@mui/system';
const { FORM_PAGES_ORDER } = config;

const ProgressBar = (props) => {
  const { bgcolor, completedPercentage } = props;

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
  };

  const fillerStyles = {
    height: '100%',
    width: `${Math.round(completedPercentage)}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right',
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <Box style={containerStyles} mb={2}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${Math.round(completedPercentage)}%`}</span>
      </div>
    </Box>
  );
};

/*
 * Spreadsheet viewer component
 * Load spreadsheet configuration from database
 * Pass configuration to table editor
 */
const SpreadsheetViewer = ({ reportId, formPageId }) => {
  const [loading, setLoading] = useState(false);
  const [spreadsheetConfig, setSpreadsheetConfig] = useState(null);
  const navigate = useNavigate();

  const loadSpreadsheetConfig = () => {
    setLoading(true);

    void fetchSpreadsheetData(reportId, formPageId)
      .then((spreadsheetConfig) => {
        setSpreadsheetConfig(spreadsheetConfig);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleNextPageSwitch = () => {
    const nextFormPageId = spreadsheetConfig ? spreadsheetConfig.nextFormPageId : null;
    navigate(`/reports/${reportId}/${nextFormPageId || formPageId}`);
  };

  const handlePrevPageSwitch = () => {
    const prevFormPageId = spreadsheetConfig ? spreadsheetConfig.prevFormPageId : null;
    navigate(`/reports/${reportId}/${prevFormPageId || formPageId}`);
  };

  const handleFormComplete = () => {
    setLoading(true);

    const newMetadata = {
      status: 'complete',
    };

    void updateReportMetadata(reportId, newMetadata)
      .then(() => {
        navigate(`/reports/${reportId}`);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleFormSaveDraft = () => {
    setLoading(true);

    void updateReportMetadata(reportId, spreadsheetConfig)
      .then(() => {
        navigate(`/reports/${reportId}`);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSpreadsheetConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPageId]);

  if (loading) {
    return (
      <Box>
        <AiOutlineLoading3Quarters /> <p>Fetching reports...</p>
      </Box>
    );
  } else if (!spreadsheetConfig) {
    return <p>Unable to load spreadsheet</p>;
  }

  const formProgress = ((FORM_PAGES_ORDER.indexOf(formPageId) + 1) / FORM_PAGES_ORDER.length) * 100;

  return (
    <Grid m={2} pt={3}>
      <Box display="flex" justifyContent="flex-start" alignItems="flex-start" px={3} my={2}>
        <Button variant="contained" size="small" color="info" onClick={handleFormSaveDraft}>
          {'<'} Back
        </Button>
      </Box>

      <ProgressBar bgcolor="green" completedPercentage={formProgress} />

      <TableEditor
        formPageId={formPageId}
        reportId={reportId}
        setPageLoading={setLoading}
        loadSpreadsheetConfig={loadSpreadsheetConfig}
        initialSpreadsheetConfig={spreadsheetConfig}
      />

      <Box display="flex" justifyContent="flex-end" alignItems="flex-end" px={3} my={2}>
        {formPageId === FORM_PAGES_ORDER[FORM_PAGES_ORDER.length - 1] ? (
          <Button variant="contained" size="small" color="success" onClick={handleFormComplete}>
            Finish
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              color="info"
              onClick={handlePrevPageSwitch}
              disabled={!spreadsheetConfig.prevFormPageId}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              size="small"
              color="info"
              onClick={handleNextPageSwitch}
              disabled={!spreadsheetConfig.nextFormPageId}
            >
              Next
            </Button>
          </>
        )}
      </Box>
    </Grid>
  );
};

export default SpreadsheetViewer;
