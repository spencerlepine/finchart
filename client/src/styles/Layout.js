import React from 'react';
import Header from '../components/Header';

const Layout = (props) => {
  return (
    <div id="finchart-root">
      <Header />

      {props.children}
    </div>
  );
};

export default Layout;
