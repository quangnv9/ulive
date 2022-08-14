import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const clientApi = axios.create();
export const axiosApiInstance = axios.create();

export const postDataNoInterceptor = <Response>(url: string, data: any, config?: AxiosRequestConfig) => {
  const configs = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  };
  const request = axiosApiInstance
    .post<Response>(url, data, configs)
    .then((res) => res.data)
    .catch((err) => {
      if (!axios.isCancel(err)) {
        throw err;
      }
    });

  return request as Promise<Response | undefined>;
};

export const getData = <Response>(url: string, config?: AxiosRequestConfig) => {
  const configs = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  };
  const request = axiosApiInstance
    .get<Response>(url, configs)
    .then((res) => res.data)
    .catch((err) => {
      if (!axios.isCancel(err)) {
        throw err;
      }
    });

  return request;
};

export const extractErrors = (error: AxiosError) => {
  throw new Error(error.response?.data.message);
};
