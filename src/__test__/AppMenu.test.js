/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { BrowserRouter as HashRouter } from 'react-router-dom';
import 'jest-dom/extend-expect';
import AppMenu from '../components/AppMenu';


const mockMenu = [
  {
    id: 1,
    name: 'Member',
    option: [
      {
        id: 2,
        name: 'MemberEdit',
        path: '/member-edit',
      },
      {
        id: 1,
        name: 'memberTable',
        path: '/member-table',
      },
    ],
  },
];

afterEach(() => {
  cleanup();
});

it('test title', () => {
  const {
    getByTestId,
  } = render(
    <HashRouter>
      <AppMenu menu={mockMenu} />
    </HashRouter>,
  );
  const header = getByTestId('title');

  fireEvent.click(header);

  expect(getByTestId('title')).toHaveTextContent('Member');
  expect(header).toHaveClass('active');

  fireEvent.click(header);
  expect(header).not.toHaveClass('active');
});

it('test content', () => {
  const {
    getByTestId,
  } = render(
    <HashRouter>
      <AppMenu menu={mockMenu} />
    </HashRouter>,
  );

  const header = getByTestId('title');

  fireEvent.click(header);

  expect(getByTestId('content')).toBeTruthy();
  expect(getByTestId('content')).toHaveClass('active');
});
