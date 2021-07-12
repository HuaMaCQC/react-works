/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import Home from '../components/Home/Home';

describe('search UI', () => {
  it('test', () => {
    render(<Home />);
  });
});
