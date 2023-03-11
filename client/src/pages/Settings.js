import React from 'react';
import Layout from '../styles/Layout';
import { Container } from '@mui/system';
import StatusWidget from '../components/StatusWidget';
import { Button, Typography, Link } from '@mui/material';

const Settings = () => {
  return (
    <Layout>
      <Container>
        <Typography>Feature under construction</Typography>

        <Typography>
          Visit: <Link href="https://github.com/spencerlepine/finchart">GitHub/finchart</Link>
        </Typography>

        <StatusWidget />

        <Button my={3} size="medium" variant="contained" contained="true" color="warning" href="/">
          Back
        </Button>
      </Container>
    </Layout>
  );
};

export default Settings;
