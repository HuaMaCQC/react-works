import Axios from 'axios';

const config = require('../config.json');

const ApiRequest = Axios.create({
  baseURL: config.ApiHost,
});

export const apiGetUser = data => ApiRequest.get('api/users', { params: data });
export const apiAddUser = data => ApiRequest.post('api/user', data);
export const apiDeleteUser = id => ApiRequest.delete(`api/user/${id}`);
export const apiEditUser = (data, id) => ApiRequest.put(`api/user/${id}`, data);
