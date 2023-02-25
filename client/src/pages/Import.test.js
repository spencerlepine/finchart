import React from 'react';
import { render } from 'testing-library';
import Import from './Import';

describe('Import Page', () => {
  it('renders import page without errors', () => {
    render(<Import />);
  });
});
