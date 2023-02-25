import axiosClient from './axiosClient';

export const loginUser = (username, password) =>
  axiosClient.post(`/auth/login`, { username, password }).then((res) => res.data);

export const logoutUser = () => axiosClient.post(`/auth/logout`, {}).then((res) => res.data);
