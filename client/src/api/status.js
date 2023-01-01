import axiosClient from './axiosClient';

export const fetchStatusData = () => axiosClient.get('/status').then((res) => res.data);
