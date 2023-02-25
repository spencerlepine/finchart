import axios from 'axios';

const client = axios.create({
  withCredentials: true,
  baseURL: `/api/v1`,
});

client.interceptors.request.use((config) => {
  config.params = {
    // add your default ones
    //  token: token,
    // spread the request's params
    ...config.params,
  };
  return config;
});

export default client;
