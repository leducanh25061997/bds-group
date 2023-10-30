import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import path from 'app/routes/path';
import { loginResponse } from 'app/pages/Auth/slice/types';

import { LocalStorageService } from '../';

import { destroyToken, saveToken, tryRefreshToken } from './authentication';

declare module 'axios' {
  export interface AxiosRequestConfig {
    throwAccessDenied?: boolean; // is true if you want to self handle access denied exception
  }
}

export const createService = (
  baseURL?: string,
  contentType: string = 'application/json',
): AxiosInstance => {
  return interceptAuth(baseConfig(baseURL, contentType));
};

export const downloadFileService = (
  baseURL?: string,
  contentType: string = 'application/json',
): AxiosInstance => {
  const config: AxiosRequestConfig = baseConfig(baseURL, contentType);
  config.responseType = 'blob';
  return interceptAuth(config);
};

const baseConfig = (
  baseURL?: string,
  contentType: string = 'application/json',
) => {
  return {
    baseURL,
    headers: {
      'Accept-Language': 'en-US',
      'Content-Type': contentType,
    },
  };
};

export const createServiceNoToken = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
    },
  });
  instance.interceptors.request.use(config => {
    return config;
  });
  return instance;
};

const interceptAuth = (config: AxiosRequestConfig) => {
  const instance = axios.create(config);
  instance.interceptors.request.use(cf => {
    const token = LocalStorageService.get(LocalStorageService.OAUTH_TOKEN);
    if (token && cf?.headers) {
      cf.headers['Authorization'] = 'Bearer ' + token;
    }
    return cf;
  });

  function createAxiosResponseInterceptor() {
    const interceptor = instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }
        axios.interceptors.response.eject(interceptor);
        return tryRefreshToken()
          .then(response => {
            const responseData: loginResponse = response.data;
            saveToken(responseData);
            error.response.config.headers['Authorization'] =
              'Bearer ' + response.data.access_token;
            return axios(error.response.config);
          })
          .catch(error => {
            destroyToken();
            window.location.href = path.login;
            return Promise.reject(error);
          })
          .finally(createAxiosResponseInterceptor);
      },
    );
  }
  createAxiosResponseInterceptor();
  return instance;
};
