/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import {
  cleanup,
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import App from '../App';
import AppHeader from '../components/AppHeader';

import AppMenu from '../components/AppMenu';
import AppTitleBar from '../components/AppTitleBar/AppTitleBar';

// 處理錯誤資訊
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

jest.mock('../components/AppHeader');
jest.mock('../components/AppMenu');
jest.mock('../components/AppTitleBar/AppTitleBar');

let headerPropsData = {};
const headerMockElement = (data) => {
  headerPropsData = data;
  return (<div />);
};
AppHeader.mockImplementation(headerMockElement);

let menuPropsData = {};
const menuMockElement = (data) => {
  menuPropsData = data;
  return (<div />);
};
AppMenu.mockImplementation(menuMockElement);

let titlePropsData = {};
const titleMockElement = (data) => {
  titlePropsData = data;
  return (<div />);
};
AppTitleBar.mockImplementation(titleMockElement);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

it('Snapshot Testing', () => {
  const { container } = render(<App />);

  expect(container).toMatchSnapshot();
});

it('test Menu ', () => {
  const { getByTestId } = render(<App />);

  expect(getByTestId('menu')).toBeTruthy();
  expect(getByTestId('menu')).not.toHaveClass('hide');

  headerPropsData.switchMenu();

  expect(getByTestId('menu')).toHaveClass('hide');
});

it('test title', () => {
  render(<App />);
  menuPropsData.setTitle('test');
  expect(titlePropsData.title).toBe('test');
});
