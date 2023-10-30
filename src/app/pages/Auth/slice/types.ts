/* --- STATE --- */
import { EnumObject, ItemProject, Pageable, UserInfo } from 'types';
import { User } from 'types/User';

export interface AuthState {
  title?: string;
  subtitle?: string;
  userInfo?: UserInfo;
  loading?: boolean;
  password?: string;
  enumList?: EnumObject[];
  projectList?: Pageable<ItemProject>;
  isLoading?: boolean;
  // updateUser?: PayloadUpdateUser
}

export interface loginResponse {
  accessToken: string;
  refresh_token: string;
  scope: string;
  session_state: string;
  expiresIn: number;
  refresh_expires_in: number;
  token_type: string;
}
