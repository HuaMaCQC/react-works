/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import AppFooter from '../components/AppFooter';

describe('search UI', () => {
  it('test', () => {
    render(<AppFooter />);
  });
});
