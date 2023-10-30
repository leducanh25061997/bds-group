import { PayloadAction } from '@reduxjs/toolkit';
import { socketClose } from 'app/components/Socket';
import {
  AuthParams,
  ChangePasswordParams,
  UpdatePassword,
  Pageable,
  ItemProject,
  ResetPassParams,
  PayloadUpdateAvatarUser,
} from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { authSaga } from './saga';
import { AuthState } from './types';

export const initialState: AuthState = {};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: {
      reducer(state) {
        return state;
      },
      prepare(params: AuthParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    loginSuccess(state, action: PayloadAction<any>) {},
    logout: {
      reducer(state) {
        return state;
      },
      prepare(params, meta: (err: any) => void) {
        return { payload: params, meta };
      },
    },
    logoutSuccess() {
      socketClose();
    },
    getUserInfo() {},
    getUserInfoSuccess(state, action) {
      state.userInfo = action.payload;
    },

    updatedAvatarUser: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateAvatarUser, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updatedAvatarUserSuccess: () => {},

    forgotPassword: {
      reducer(state) {
        return state;
      },
      prepare(params: ResetPassParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    forgotPasswordSuccess() {},
    resetPassword: {
      reducer(state) {
        return state;
      },
      prepare(params: UpdatePassword, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    resetPasswordSuccess() {},
    getListEnum() {},
    getListEnumSuccess(state, action) {
      state.enumList = action.payload;
    },
    getListProject(state, action) {
      state.isLoading = true;
    },
    getListProjectsSuccess: (
      state,
      action: PayloadAction<Pageable<ItemProject>>,
    ) => {
      state.projectList = action.payload;
      state.isLoading = false;
    },
    changePassword: {
      reducer(state) {
        return state;
      },
      prepare(params: ChangePasswordParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    changePasswordSuccess() {},
  },
});

export const { actions: authActions } = slice;

export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSaga });
  return { actions: slice.actions };
};
