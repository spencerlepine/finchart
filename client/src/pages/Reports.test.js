import React from 'react';
import { render } from 'testing-library';
import Reports from './Reports';

describe('Reports Page', () => {
  it('renders reports page without errors', () => {
    render(<Reports />);
  });
});
