import React from 'react';
import { render } from 'testing-library';
import Missing from './Missing';

describe('Missing Page', () => {
  it('renders missing page without errors', () => {
    render(<Missing />);
  });
});
