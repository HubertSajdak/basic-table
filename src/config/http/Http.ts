import axios, { type AxiosRequestConfig } from 'axios';

export const Http = {
  get: async <T>(path: string, params?: object, config?: AxiosRequestConfig) => {
    const response = await axios.get(path, { ...config, params });
    return response.data as T;
  },
  post: async <T>(path: string, body?: unknown, config?: AxiosRequestConfig) => {
    const response = await axios.post(path, body, config);
    return response.data as T;
  },
  put: async <T>(path: string, body?: unknown, config?: AxiosRequestConfig) => {
    const response = await axios.put(path, body, config);
    return response.data as T;
  },
  patch: async <T>(path: string, body?: unknown, config?: AxiosRequestConfig) => {
    const response = await axios.patch(path, body, config);
    return response.data as T;
  },
  delete: async <T>(path: string, params?: object, config?: AxiosRequestConfig) => {
    const response = await axios.delete(path, { ...config, params });
    return response.data as T;
  },
};
