/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import ErrorBox from '../components/ErrorBox/ErrorBox';

describe('search UI', () => {
  it('test', () => {
    render(<ErrorBox />);
  });
});
