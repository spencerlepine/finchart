import React from 'react';
import { render } from 'testing-library';
import ViewReport from './ViewReport';

describe('ViewReport Page', () => {
  it('renders view report edit page without errors', () => {
    render(<ViewReport />);
  });
});
