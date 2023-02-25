import React from 'react';
import { render } from 'testing-library';
import SpreadsheetEdit from './SpreadsheetEdit';

describe('SpreadsheetEdit Page', () => {
  it('renders spreadsheet edit page without errors', () => {
    render(<SpreadsheetEdit />);
  });
});
