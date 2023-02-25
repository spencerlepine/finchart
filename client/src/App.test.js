import React from 'react';
import { render, screen } from 'testing-library';
import App from './App';

test('renders app name', () => {
  render(<App />);
  const logoElement = screen.getByTestId('navbar-logo');
  expect(logoElement).toBeInTheDocument();
  expect(logoElement).toHaveTextContent('FinChart');
});
