
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
// 要測試的組件
import MemberList from '../components/member/memberList/MemberList';
import { apiGetUser, apiDeleteUser } from '../core/api';
import MemberEditAddModal from '../components/member/memberList/MemberListModal/MemberEditAddModal';
import createCsvFile from '../public/CreateCsvFile';

const moment = require.requireActual('moment-timezone');
const apiMock = require('../__mocks__/ApiMemberListMocks');

const originalError = console.error;

jest.mock('../components/member/memberList/MemberListModal/MemberEditAddModal');
jest.mock('../core/api');
jest.mock('../public/CreateCsvFile');
moment.tz.setDefault('Asia/Taipei');

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('search UI', () => {
  let component = {
    getByTestId: null,
  };

  beforeAll(() => {
    cleanup();
    MemberEditAddModal.mockImplementation(jest.fn(() => <div />));
    apiGetUser.mockImplementation(apiMock.apiGetUser);
    component = render(<MemberList />);
  });

  it('search-username ', async () => {
    const { getByTestId } = component;
    const username = getByTestId('search-username').querySelector('input');

    fireEvent.change(username, { target: { value: 'test' } });

    expect(getByTestId('search-username')).toBeTruthy();
    expect(username.placeholder).toBe('請輸入姓名');
    expect(username.value).toBe('test');
  });

  it('search-enable ', () => {
    const { getByTestId } = component;
    const enableOption = getByTestId('search-enable').querySelectorAll('span');
    const enableBtn = getByTestId('search-enable').querySelectorAll('div')[3];
    const value = getByTestId('search-enable').querySelectorAll('div')[0];

    expect(value).toHaveTextContent(/^全部$/);

    fireEvent.click(enableBtn);

    expect(getByTestId('search-enable')).toBeTruthy();
    expect(enableOption).toHaveLength(3);
    expect(value).toHaveTextContent(/^啟用$/);
  });

  it('search-locked ', () => {
    const { getByTestId } = component;
    const lockedOption = getByTestId('search-locked').querySelectorAll('span');
    const lockedBtn = getByTestId('search-locked').querySelectorAll('div')[3];
    const value = getByTestId('search-locked').querySelectorAll('div')[0];

    expect(value).toHaveTextContent(/^全部$/);

    fireEvent.click(lockedBtn);

    expect(value).toHaveTextContent(/^鎖定$/);
    expect(getByTestId('search-locked')).toBeTruthy();
    expect(lockedOption).toHaveLength(3);
  });

  it('search-start_created_at ', () => {
    const { getByTestId } = component;
    const startCreatedAtInput = getByTestId('search-start_created_at').querySelector('input');

    fireEvent.change(startCreatedAtInput, { target: { value: '2000-01-01 00:00:00' } });

    expect(getByTestId('search-start_created_at')).toBeTruthy();
    expect(startCreatedAtInput.placeholder).toBe('全部時間');
    expect(startCreatedAtInput.value).toBe('2000-01-01 00:00:00');
  });

  it('search-end_created_at ', () => {
    const { getByTestId } = component;
    const endCreatedAtInput = getByTestId('search-end_created_at').querySelector('input');

    fireEvent.change(endCreatedAtInput, { target: { value: '2000-01-01 00:00:00' } });

    expect(getByTestId('search-end_created_at')).toBeTruthy();
    expect(endCreatedAtInput.placeholder).toBe('全部時間');
    expect(endCreatedAtInput.value).toBe('2000-01-01 00:00:00');

    fireEvent.change(endCreatedAtInput, { target: { value: '' } });
    expect(endCreatedAtInput.value).toBe('');
  });

  it('search button', () => {
    const { getByTestId } = component;
    const mockResData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 1,
            locked: 1,
            username: 'user1',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    const mockFindData = {
      username: 'test',
      enable: 1,
      locked: 1,
      start_created_at: moment('2000-01-01 00:00:00').format(),
      end_created_at: undefined,
      max_results: 5,
      first_result: 0,
    };
    const apiGetUserFn = jest.fn(() => Promise.resolve(mockResData));

    apiGetUser.mockImplementation(apiGetUserFn);

    const button = getByTestId('search-btn');

    fireEvent.click(button);

    expect(getByTestId('search-btn')).toBeTruthy();
    expect(button).toHaveTextContent(/^查詢$/);
    expect(apiGetUserFn).toHaveBeenCalledTimes(1);
    expect(apiGetUserFn).toHaveBeenCalledWith(mockFindData);
  });
});

describe('Member Table', () => {
  beforeAll(() => {
    cleanup();
  });

  beforeEach(() => {
    MemberEditAddModal.mockImplementation(jest.fn(() => <div />));
    apiGetUser.mockImplementation(apiMock.apiGetUser);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('table header', () => {
    const { getByTestId } = render(<MemberList />);
    const header = getByTestId('table-header').querySelectorAll('th');

    expect(header).toHaveLength(6);
  });

  it('table 資料', async () => {
    const { getByTestId } = render(<MemberList />);
    const table = await waitForElement(() => getByTestId('table-list'));
    const tds0 = table.querySelectorAll('tr')[0].querySelectorAll('td');
    const tds1 = table.querySelectorAll('tr')[1].querySelectorAll('td');
    const time = moment('2019-06-16T21:36:04+08:00').format('YYYY-MM-DD hh:mm:ss');

    expect(table.querySelectorAll('tr')).toHaveLength(5);
    expect(tds0[0]).toHaveTextContent(/^1$/);
    expect(tds0[1]).toHaveTextContent(/^user1$/);
    expect(tds0[2]).toHaveTextContent(/^啟動$/);
    expect(tds0[3]).toHaveTextContent(/^鎖定$/);
    expect(tds0[4]).toHaveTextContent(time);
    expect(tds0[2]).toHaveClass('member-not-lock');
    expect(tds0[3]).toHaveClass('member-lock');
    expect(tds1[2]).toHaveTextContent(/^未啟動$/);
    expect(tds1[3]).toHaveTextContent(/^未鎖定$/);
    expect(tds1[2]).toHaveClass('member-lock');
    expect(tds1[3]).toHaveClass('member-not-lock');
  });

  it('table Snapshot Testing', async () => {
    const { getByTestId } = render(<MemberList />);
    const table = await waitForElement(() => getByTestId('table-list'));

    expect(table).toMatchSnapshot();
  });

  it('table delete button', async () => {
    // 初始化模擬資料
    const initData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 298,
            locked: 1,
            username: 'user298',
          },
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 299,
            locked: 1,
            username: 'user299',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    const apiGetUserFnInit = jest.fn(() => Promise.resolve(initData));
    const apiDeleteUserFn = jest.fn(() => Promise.resolve());
    apiDeleteUser.mockImplementation(apiDeleteUserFn);

    apiGetUser.mockImplementation(apiGetUserFnInit);

    const { getByTestId, rerender } = render(<MemberList />);

    const table = await waitForElement(() => getByTestId('table-list'));
    const delBtn = table
      .querySelector('tr')
      .querySelectorAll('td')[5]
      .querySelectorAll('button')[1];

    fireEvent.click(delBtn);

    // 模擬刪除後回傳
    const delFinishData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 299,
            locked: 1,
            username: 'user299',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    const apiGetUserFn = jest.fn(() => Promise.resolve(delFinishData));
    apiGetUser.mockImplementation(apiGetUserFn);

    rerender(<MemberList />);

    const delFinshTable = await waitForElement(() => getByTestId('table-list'));
    const id = delFinshTable
      .querySelector('tr')
      .querySelectorAll('td')[0];

    expect(apiDeleteUserFn).toHaveBeenCalledTimes(1);
    expect(id).toHaveTextContent(/^299$/);
    expect(apiDeleteUserFn).toHaveBeenCalledWith('298');
    expect(delBtn).toHaveTextContent(/^刪除$/);
  });

  it('table Pagination', async () => {
    const { getByTestId, rerender } = render(<MemberList />);
    const pagination = await waitForElement(() => getByTestId('table-pagination'));
    const pageBen = pagination.querySelectorAll('a');

    const nextPageData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 666,
            locked: 1,
            username: 'user666',
          },
        ],
        pagination: {
          first_result: '5',
          max_results: '1',
          total: 50,
        },
      },
    };
    const apiGetUserNextPageData = jest.fn(() => Promise.resolve(nextPageData));
    apiGetUser.mockImplementation(apiGetUserNextPageData);

    fireEvent.click(pageBen[3]);


    rerender(<MemberList />);

    const table = await waitForElement(() => getByTestId('table-list'));
    const id = table.querySelector('tr').querySelectorAll('td')[0];
    const findData = {
      enable: undefined,
      end_created_at: undefined,
      first_result: 5,
      locked: undefined,
      max_results: 5,
      start_created_at: undefined,
      username: undefined,
    };

    expect(apiGetUserNextPageData).toHaveBeenCalledWith(findData);
    expect(apiGetUserNextPageData).toHaveBeenCalledTimes(1);
    expect(id).toHaveTextContent(/^666$/);
    expect(pageBen[3]).toHaveTextContent(/^2$/);
    expect(pageBen).toHaveLength(13);
  });

  it('member Add', async () => {
    let propsData = {};
    const mockElement = (data) => {
      propsData = data;
      return (<div />);
    };
    MemberEditAddModal.mockImplementation(mockElement);
    const { getByTestId, rerender } = render(<MemberList />);
    const addBtn = await waitForElement(() => getByTestId('member-add'));
    // 按下新增
    fireEvent.click(addBtn);

    expect(addBtn).toHaveTextContent(/^新增$/);
    expect(propsData.open).toBe(true);
    expect(propsData.modalData).toEqual({
      type: 'insert',
      id: 0,
      username: '',
      enable: 1,
      locked: 0,
      title: '新增',
    });

    // 執行關閉
    propsData.close();
    expect(propsData.open).toBe(false);

    const delFinishData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 8,
            locked: 1,
            username: 'user299',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    const apiGetUserFn = jest.fn(() => Promise.resolve(delFinishData));
    apiGetUser.mockImplementation(apiGetUserFn);

    // 按下新增
    fireEvent.click(addBtn);
    // 執行完成
    propsData.onComplete();

    rerender(<MemberList />);

    const table = await waitForElement(() => getByTestId('table-list'));
    const id = table.querySelector('tr').querySelectorAll('td')[0];

    expect(propsData.open).toBe(false);
    expect(apiGetUserFn).toHaveBeenCalledTimes(1);
    expect(id).toHaveTextContent(/^8$/);
  });

  it('export Csv', async () => {
    // 模擬apiGetUser
    const mockApiGetUserData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 88,
            locked: 1,
            username: 'isCsvTest',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    apiGetUser.mockImplementation(jest.fn(() => Promise.resolve(mockApiGetUserData)));

    // 模擬創建下載點
    const mockCreateCsvFile = jest.fn(() => '/download-csv');
    createCsvFile.mockImplementation(mockCreateCsvFile);

    // 開始測試
    const { getByTestId } = render(<MemberList />);
    const exportCsvBtn = await waitForElement(() => getByTestId('export-csv'));

    fireEvent.click(exportCsvBtn);

    const newBtn = await waitForElement(() => getByTestId('export-csv'));

    expect(newBtn.download).toBe('會員資料.csv');
    expect(mockCreateCsvFile).toHaveBeenCalledTimes(1);
    expect(mockCreateCsvFile).toHaveBeenCalledWith(
      [
        ['id', '姓名', '狀態', '鎖定', '創建時間'],
        [88, 'isCsvTest', '啟動', '鎖定', '2019-01-16 09:36:04'],
      ],
    );
    expect(newBtn.href).toBe('http://localhost/download-csv');

    // 模擬二次取得資料
    const mockApiGetUserData2 = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 0,
            id: 66,
            locked: 0,
            username: 'isCsvTest2',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    apiGetUser.mockImplementation(jest.fn(() => Promise.resolve(mockApiGetUserData2)));

    const searchBtn = getByTestId('search-btn');

    await fireEvent.click(searchBtn);
    fireEvent.click(exportCsvBtn);

    expect(mockCreateCsvFile).toHaveBeenCalledTimes(2);
    expect(mockCreateCsvFile).toHaveBeenLastCalledWith(
      [
        ['id', '姓名', '狀態', '鎖定', '創建時間'],
        [66, 'isCsvTest2', '未啟動', '未鎖定', '2019-01-16 09:36:04'],
      ],
    );
  });

  it('member Edit', async () => {
    const mockApiGetUserData = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: undefined,
            id: 9,
            locked: undefined,
            username: undefined,
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    apiGetUser.mockImplementation(jest.fn(() => Promise.resolve(mockApiGetUserData)));

    let propsData = {};
    const mockElement = (data) => {
      propsData = data;
      return (<div />);
    };
    MemberEditAddModal.mockImplementation(mockElement);

    const { getByTestId, rerender } = render(<MemberList />);
    const table = await waitForElement(() => getByTestId('table-list'));
    const editBtn = table
      .querySelector('tr')
      .querySelectorAll('td')[5]
      .querySelectorAll('button')[0];

    // // 按下修改
    fireEvent.click(editBtn);

    expect(editBtn).toHaveTextContent(/^編輯$/);
    expect(propsData.open).toBe(true);
    expect(propsData.modalData).toEqual({
      type: 'edit',
      id: 9,
      username: '',
      enable: 0,
      locked: 1,
      title: '修改',
    });

    const data2 = {
      data: {
        result: 'ok',
        ret: [
          {
            created_at: '2019-01-16T21:36:04+08:00',
            enable: 1,
            id: 10,
            locked: 1,
            username: 'userEdit',
          },
        ],
        pagination: {
          first_result: '0',
          max_results: '5',
          total: 50,
        },
      },
    };
    apiGetUser.mockImplementation(jest.fn(() => Promise.resolve(data2)));

    // 完成關閉
    propsData.onComplete();

    rerender(<MemberList />);

    const table2 = await waitForElement(() => getByTestId('table-list'));
    const editBtn2 = table2
      .querySelector('tr')
      .querySelectorAll('td')[5]
      .querySelectorAll('button')[0];

    // 按下修改
    fireEvent.click(editBtn2);

    expect(propsData.modalData).toEqual(
      {
        type: 'edit',
        id: 10,
        username: 'userEdit',
        enable: 1,
        locked: 1,
        title: '修改',
      },
    );
  });
});
