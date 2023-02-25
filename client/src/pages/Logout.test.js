import React from 'react';
import { render } from 'testing-library';
import Logout from './Logout';

describe('Logout Page', () => {
  it('renders logout page without errors', () => {
    render(<Logout />);
  });
});
