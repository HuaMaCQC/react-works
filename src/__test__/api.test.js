/* eslint-disable global-require */
/* eslint-disable no-undef */
import mockAxios from '../__mocks__/axiosMock';
import {
  apiGetUser,
  apiAddUser,
  apiDeleteUser,
  apiEditUser,
} from '../core/api';

jest.mock('axios', () => require('../__mocks__/axiosMock'));

describe('test api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('apiGetUser', async () => {
    const mockData = { userid: 1 };
    const url = 'api/users';

    mockAxios.get.mockImplementationOnce((...args) => Promise.resolve(args));

    expect(await apiGetUser(mockData)).toEqual([url, { params: mockData }]);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });

  it('apiGetUser', async () => {
    const mockData = { userid: 2 };
    const url = 'api/user';

    mockAxios.post.mockImplementationOnce((...args) => Promise.resolve(args));

    expect(await apiAddUser(mockData)).toEqual([url, mockData]);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  it('apiDeleteUser', async () => {
    const mockid = 3;
    const url = 'api/user/';

    mockAxios.delete.mockImplementationOnce((...args) => Promise.resolve(args));

    expect(await apiDeleteUser(mockid)).toEqual([`${url}${mockid}`]);
    expect(mockAxios.delete).toHaveBeenCalledTimes(1);
  });

  it('apiEditUser', async () => {
    const mockData = { userid: 4 };
    const mockId = 4;
    const url = 'api/user/';

    mockAxios.put.mockImplementationOnce((...args) => Promise.resolve(args));

    expect(await apiEditUser(mockData, mockId)).toEqual([`${url}${mockId}`, mockData]);
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
  });
});
