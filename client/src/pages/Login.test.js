import React from 'react';
import { render } from 'testing-library';
import Login from './Login';

describe('Login Page', () => {
  it('renders login page without errors', () => {
    render(<Login />);
  });
});
