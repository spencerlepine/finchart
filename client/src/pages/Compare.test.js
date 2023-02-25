import React from 'react';
import { render } from 'testing-library';
import Compare from './Compare';

describe('Compare Page', () => {
  it('renders compare page without errors', () => {
    render(<Compare />);
  });
});
