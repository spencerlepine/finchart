import React from 'react';
import { useParams } from 'react-router-dom';
import SpreadsheetViewer from '../components/SpreadsheetViewer';
import Layout from '../styles/Layout';

const SpreadsheetEdit = () => {
  const { reportId, formPageId } = useParams();

  return (
    <Layout>
      <SpreadsheetViewer reportId={reportId} formPageId={formPageId} />
    </Layout>
  );
};

export default SpreadsheetEdit;
