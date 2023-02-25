import React from 'react';
import ReportSnapshot from '../components/ReportSnapshot';
import { useParams } from 'react-router-dom';
import Layout from '../styles/Layout';

const ViewReport = () => {
  const { reportId } = useParams();

  return (
    <Layout>
      <ReportSnapshot reportId={reportId} />
    </Layout>
  );
};

export default ViewReport;
