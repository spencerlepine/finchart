import React from 'react';
import { render } from 'testing-library';
import Settings from './Settings';

describe('Settings Page', () => {
  it('renders settings page without errors', () => {
    render(<Settings />);
  });
});
