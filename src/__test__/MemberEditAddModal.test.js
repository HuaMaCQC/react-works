/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import MemberEditAddModal
  from '../components/member/memberList/MemberListModal/MemberEditAddModal';
import { apiEditUser, apiAddUser } from '../core/api';

jest.mock('../core/api');

describe('test edit', () => {
  const close = jest.fn();
  const onComplete = jest.fn();
  const mockProps = {
    open: true,
    modalData: {
      id: 22,
      username: 'userTestEdit',
      enable: 1,
      locked: 0,
      title: '編輯',
      type: 'edit',
    },
    close,
    onComplete,
  };

  let component = {
    getByTestId: null,
    rerender: null,
  };

  beforeAll(() => {
    cleanup();
    component = render(<MemberEditAddModal {...mockProps} />);
  });

  it('test title', () => {
    const { getByTestId } = component;
    expect(getByTestId('title')).toHaveTextContent('編輯');
  });

  it('test id', async () => {
    const { getByTestId } = component;
    const id = await waitForElement(() => getByTestId('form').querySelector('div'));
    expect(id.querySelector('div')).toHaveTextContent('id : 22');
  });

  it('test name', async () => {
    const { getByTestId } = component;
    const username = getByTestId('username').querySelector('input');
    fireEvent.change(username, { target: { value: 'isEdit' } });

    expect(username.placeholder).toBe('請輸入姓名');
    expect(username.value).toBe('isEdit');
  });

  it('test enable', () => {
    const { getByTestId } = component;
    const enableOption = getByTestId('enable').querySelectorAll('span');
    const enableBtn = getByTestId('enable').querySelectorAll('div')[3];
    const value = getByTestId('enable').querySelectorAll('div')[0];

    expect(value).toHaveTextContent(/^啟用$/);
    fireEvent.click(enableBtn);

    expect(getByTestId('enable')).toBeTruthy();
    expect(enableOption).toHaveLength(2);
    expect(value).toHaveTextContent(/^未啟用$/);
  });

  it('test locked', () => {
    const { getByTestId } = component;
    const lockedOption = getByTestId('locked').querySelectorAll('span');
    const lockedBtn = getByTestId('locked').querySelectorAll('div')[2];
    const value = getByTestId('locked').querySelectorAll('div')[0];

    expect(value).toHaveTextContent(/^未鎖定$/);

    fireEvent.click(lockedBtn);

    expect(getByTestId('locked')).toBeTruthy();
    expect(lockedOption).toHaveLength(2);
    expect(value).toHaveTextContent(/^鎖定$/);
  });

  it('test save', async () => {
    const apiEditUserMock = jest.fn(() => Promise.resolve({
      data: {
        result: 'ok',
      },
    }));
    apiEditUser.mockImplementation(apiEditUserMock);

    const { getByTestId } = component;
    const savebtn = getByTestId('save');

    await fireEvent.click(savebtn);

    expect(apiEditUserMock).toHaveBeenCalledWith(
      {
        enable: 0,
        locked: 1,
        username: 'isEdit',
      },
      22,
    );

    expect(apiEditUserMock).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('test close', () => {
    const { getByTestId } = component;
    const closebtn = getByTestId('close');

    fireEvent.click(closebtn);

    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe('test add', () => {
  const close = jest.fn();
  const onComplete = jest.fn();
  const mockProps = {
    open: true,
    modalData: {
      id: 0,
      username: '',
      enable: 1,
      locked: 0,
      title: '新增',
      type: 'insert',
    },
    close,
    onComplete,
  };

  let component = {
    getByTestId: null,
  };

  beforeAll(() => {
    cleanup();
    component = render(<MemberEditAddModal {...mockProps} />);
  });

  it('test save', async () => {
    const apiAddUserMock = jest.fn(() => Promise.resolve({
      data: {
        result: 'ok',
      },
    }));
    apiAddUser.mockImplementation(apiAddUserMock);

    const { getByTestId } = component;

    const id = await waitForElement(() => getByTestId('form').querySelector('div'));
    expect(id.querySelector('div')).toHaveTextContent(/^$/);

    // 輸入name
    const username = getByTestId('username').querySelector('input');
    fireEvent.change(username, { target: { value: 'isAdd' } });

    // 切換未啟用
    const enableBtn = getByTestId('enable').querySelectorAll('div')[3];
    fireEvent.click(enableBtn);

    // 切換鎖定
    const lockedBtn = getByTestId('locked').querySelectorAll('div')[2];
    fireEvent.click(lockedBtn);

    // 存檔
    const savebtn = getByTestId('save');
    await fireEvent.click(savebtn);

    expect(apiAddUserMock).toHaveBeenCalledWith(
      {
        enable: 0,
        locked: 1,
        username: 'isAdd',
      },
    );
    expect(apiAddUserMock).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
