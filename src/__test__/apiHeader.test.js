/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import AppHeader from '../components/AppHeader';

describe('search UI', () => {
  const mock = {
    user: { id: 1, name: 'HuaMa' },
    switchMenu: jest.fn(),
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('Snapshot Testing', () => {
    const { container } = render(<AppHeader {...mock} />);

    expect(container).toMatchSnapshot();
  });

  it('switchMenu', () => {
    const {
      getByTestId,
    } = render(<AppHeader {...mock} />);

    const switchMenuBtn = getByTestId('switchMenu');

    fireEvent.click(switchMenuBtn);

    expect(mock.switchMenu).toHaveBeenCalledTimes(1);
  });
});
