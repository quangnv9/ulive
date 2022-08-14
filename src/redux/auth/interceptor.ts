import type { Store } from 'redux/store';
import { getCurrentUser } from './auth.selectors';
import { authActions, refreshToken } from './auth.slice';
import Axios from 'axios';
import { clientApi, axiosApiInstance } from 'utils/api';
import { isNil } from 'utils/helper';

export const setupAuthInterceptor = (store: Store) => {
  axiosApiInstance.defaults.headers['Language-Code'] = localStorage.getItem('i18nextLng');
  clientApi.defaults.headers['Language-Code'] = localStorage.getItem('i18nextLng');

  clientApi.interceptors.request.use((requestConfig) => {
    const currentUser = getCurrentUser(store.getState());
    if (currentUser) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${currentUser!.accessToken}`,
      };
    }
    return requestConfig;
  });

  // Response interceptor for API calls
  clientApi.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (isNil(error.response)) {
        return Promise.reject(error);
      } else if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshTokenPromise = await store.dispatch(refreshToken());
        Axios.defaults.headers.common['Authorization'] = `Bearer ${refreshTokenPromise.accessToken}`;
        return clientApi(originalRequest);
      } else if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }
      return Promise.reject(store.dispatch(authActions.logout()));
    },
  );
};
