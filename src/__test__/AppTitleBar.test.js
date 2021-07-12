/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import {
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import AppTitleBar from '../components/AppTitleBar/AppTitleBar';

describe('search UI', () => {
  it('search title', () => {
    const titleMock = 'test menu';
    const { getByTestId } = render(<AppTitleBar title={titleMock} />);

    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('title')).toHaveTextContent(titleMock);
  });
});
