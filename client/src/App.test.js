import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders app name', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const logoElement = screen.getByTestId('navbar-logo');
  expect(logoElement).toBeInTheDocument();
  expect(logoElement).toHaveTextContent('FinChart');
});
