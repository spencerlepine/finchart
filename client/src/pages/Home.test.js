import React from 'react';
import { render } from 'testing-library';
import Home from './Home';

describe('Home Page', () => {
  it('renders home page without errors', () => {
    render(<Home />);
  });
});
