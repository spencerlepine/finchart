import { Container } from '@mui/system';
import React from 'react';
import Header from '../components/Header';

const Layout = (props) => {
  return (
    <div id="finchart-root">
      <Header />

      <Container sx={{ my: 3 }}>{props.children}</Container>
    </div>
  );
};

export default Layout;
