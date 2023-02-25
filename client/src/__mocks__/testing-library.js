import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
// import { ThemeProvider } from 'context/ThemeProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import '@testing-library/jest-dom';

const history = createBrowserHistory();

const AllTheProviders = ({ children }) => (
  // <ThemeProvider theme="light">
  <Router history={history}>{children}</Router>
  // </ThemeProvider>
);

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
