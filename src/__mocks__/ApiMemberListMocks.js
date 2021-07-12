import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(Axios);

// 假資料
mock.onGet('api/users').reply(200, {
  result: 'ok',
  ret: [
    {
      created_at: '2019-06-16T21:36:04+08:00',
      enable: 1,
      id: 1,
      locked: 1,
      username: 'user1',
    },
    {
      created_at: '2019-06-16T21:36:04+08:00',
      enable: 0,
      id: 2,
      locked: 0,
      username: 'user2',
    },
    {
      created_at: '2019-06-16T21:36:04+08:00',
      enable: 1,
      id: 3,
      locked: 1,
      username: 'user3',
    },
    {
      created_at: '2019-06-16T21:36:04+08:00',
      enable: 1,
      id: 4,
      locked: 1,
      username: 'user4',
    },
    {
      created_at: '2019-06-16T21:36:04+08:00',
      enable: 1,
      id: 5,
      locked: 1,
      username: 'user5',
    },
  ],
  pagination: {
    first_result: '0',
    max_results: '5',
    total: 50,
  },
});

const Url = new RegExp('api/user/[0-9]+');
mock.onDelete(Url).reply(200);
mock.onPost('api/user').reply(200);
mock.onPut(Url).reply(200);

const ApiRequest = Axios.create({
  baseURL: '',
});
export const apiGetUser = data => ApiRequest.get('api/users', { params: data });
export const apiAddUser = data => ApiRequest.post('api/user', data);
export const apiDeleteUser = id => ApiRequest.delete(`api/user/${id}`);
export const apiEditUser = (data, id) => ApiRequest.put(`api/user/${id}`, data);
