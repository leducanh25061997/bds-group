import { LocalStorageService } from 'services';
import queryString from 'query-string';
import {
  AuthParams,
  AuthResponse,
  EnumObject,
  UserInfo,
  ChangePasswordParams,
  UpdatePassword,
  ItemProject,
  Pageable,
  FilterParams,
  ResetPassParams,
  PayloadUpdateAvatarUser,
} from 'types';
import axios from 'axios';
import { loginResponse } from 'app/pages/Auth/slice/types';

import { serialize } from 'utils/helpers';

import { createService, createServiceNoToken } from './axios';

const TokenUrl = process.env.REACT_APP_KEYCLOAK_TOKEN_URL;
const keyCloakTokenUrl = TokenUrl as string;

const instance = createServiceNoToken(process.env.REACT_APP_API_URL);
const instanceWithToken = createService(process.env.REACT_APP_API_URL);
const instanceLogout = createServiceNoToken(
  process.env.REACT_APP_KEYCLOAK_LOGOUT_URL,
);

const login = async (params: AuthParams): Promise<AuthResponse> => {
  params.email = params.email.trim();
  params.password = params.password.trim();
  const res = await instance.post('/api/auth/signin', JSON.stringify(params), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

const getUserInfo = async (): Promise<UserInfo> => {
  const res = await instanceWithToken.get('/api/auth/me');
  return res.data;
};

export const destroyToken = () => {
  LocalStorageService.removeAllItem();
};

const verifyUser = async (): Promise<any> => {
  const url = '/users/verify';
  const res = await instanceWithToken.get(url);
  return res.status;
};

export const tryRefreshToken = () => {
  return authRequest({
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: LocalStorageService.get('refresh_token'),
  });
};

export const saveToken = (responseData: loginResponse) => {
  LocalStorageService.set('access_token', responseData.accessToken);
  LocalStorageService.set('refresh_token', responseData.refresh_token);
};

export const authRequest = (data: Record<string, any>) => {
  return axios.post(keyCloakTokenUrl, queryString.stringify(data));
};

const logout = async (): Promise<any> => {
  const refresh_token = LocalStorageService.get(
    LocalStorageService.REFRESH_TOKEN,
  );
  const access_token = LocalStorageService.get(LocalStorageService.OAUTH_TOKEN);
  const request = {
    refresh_token,
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  };
  await instanceLogout.post('', queryString.stringify(request), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    },
  });
};

const resetPassword = async (params: UpdatePassword) => {
  const res = await instance.post(
    `/auth/reset-password/${params.token}`,
    JSON.stringify(params),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
};

const getListEnum = async (): Promise<EnumObject[]> => {
  const res = await instanceWithToken.get('/ctlotus-enum/find-all');
  return res.data;
};

const getListProject = async (
  params?: FilterParams,
): Promise<Pageable<ItemProject>> => {
  const res = await instance.get(`/api/project?${serialize(params)}`);
  return res.data;
};

const forgot = async (params: ResetPassParams) => {
  const res = await instanceWithToken.patch(
    '/api/staff/reset-pass',
    JSON.stringify(params)
  );
  return res.data;
};

const changePassword = async (params: ChangePasswordParams) => {
  const res = await instanceWithToken.patch(
    '/api/staff/change-pass',
    JSON.stringify(params),
  );
  return res.data;
};

const randomPassword = async () => {
  const res = await instanceWithToken.get('/user/create-random-pass');
  return res.data;
};

const getStaffInfo = async () => {
  const res = await instanceWithToken.get('/user/create-random-pass');
  return res.data;
};

const updatedAvatarUser = async (params?: PayloadUpdateAvatarUser) => {
  const res = await instanceWithToken.post(`/user/change-avatar`, params);
  return res.data;
};

export default {
  login,
  getUserInfo,
  verifyUser,
  logout,
  forgot,
  getListEnum,
  changePassword,
  resetPassword,
  randomPassword,
  getStaffInfo,
  getListProject,
  updatedAvatarUser,
};
