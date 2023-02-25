import React from 'react';
import Layout from '../styles/Layout';
import { Container } from '@mui/system';
import StatusWidget from '../components/StatusWidget';
import { Button } from '@mui/material';

const Settings = () => {
  return (
    <Layout>
      <Container>
        <p>Feature under construction</p>

        <Button size="medium" variant="contained" contained="true" color="warning" href="/">
          Back
        </Button>

        <StatusWidget />
      </Container>
    </Layout>
  );
};

export default Settings;
