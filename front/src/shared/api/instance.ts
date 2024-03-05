import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const instanceWithOptions = (options: any = {}) => {
  const axiosInstance = axios.create({
    ...options,
    baseURL: `${options.baseURL}`,
    withCredentials: true,
    credentials: 'same-origin',
    crossdomain: true,
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return axiosInstance;
};
