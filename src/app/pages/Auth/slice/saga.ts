import { call, takeLatest, put } from 'redux-saga/effects';
import {
  AuthParams,
  EnumObject,
  ResetPassParams,
  UserInfo,
  ChangePasswordParams,
  UpdatePassword,
  ItemProject,
  Pageable,
  FilterParams,
  PayloadUpdateAvatarUser,
} from 'types';
import { PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageService } from 'services';
import authentication from 'services/api/authentication';

import { authActions as actions } from '.';

export function* login(
  action: PayloadAction<AuthParams, string, (error?: any) => void>,
) {
  try {
    const res: { accessToken: string } = yield call(
      authentication.login,
      action.payload,
    );

    LocalStorageService.set(LocalStorageService.OAUTH_TOKEN, res.accessToken);
    yield put(actions.loginSuccess(res));
    action.meta({ success: true, response: res });
  } catch (error: any) {
    action.meta({ success: false, response: error.response });
  }
}

function* getUserInfo() {
  try {
    const userInfo: UserInfo = yield call(authentication.getUserInfo);
    LocalStorageService.set(LocalStorageService.PROFILE_SERVICE, userInfo);
    yield put(actions.getUserInfoSuccess(userInfo));
  } catch (err: any) {}
}

function* updatedAvatarUser(
  action: PayloadAction<PayloadUpdateAvatarUser, string, (error?: any) => void>,

) {
  try {
    yield call(authentication.updatedAvatarUser, action.payload);
    yield put(actions.updatedAvatarUserSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* getListEnum() {
  try {
    const result: EnumObject[] = yield call(authentication.getListEnum);
    yield put(actions.getListEnumSuccess(result));
  } catch (err: any) {}
}

function* getListProject(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ItemProject> = yield call(
      authentication.getListProject,
      action.payload,
    );
    yield put(actions.getListProjectsSuccess(result));
  } catch (errors) {}
}

export function* logout(
  action: PayloadAction<any, string, (err?: any) => void>,
) {
  try {
    yield call(authentication.logout);
    LocalStorageService.removeItem(LocalStorageService.OAUTH_TOKEN);
    LocalStorageService.removeAllItem();
    yield put(actions.logoutSuccess());
    action.meta();
  } catch (error: any) {
    action.meta(error.response?.data);
  }
}

export function* forgot(
  action: PayloadAction<ResetPassParams, string, (error?: any) => void>,
) {
  try {
    yield call(authentication.forgot, action.payload);
    yield put(actions.forgotPasswordSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({ success: false, response: error.response });
  }
}

export function* resetPassword(
  action: PayloadAction<UpdatePassword, string, (error?: any) => void>,
) {
  try {
    yield call(authentication.resetPassword, action.payload);
    yield put(actions.forgotPasswordSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({ success: false, response: error.response });
  }
}

export function* changePassword(
  action: PayloadAction<ChangePasswordParams, string, (error?: any) => void>,
) {
  try {
    yield call(authentication.changePassword, action.payload);
    yield put(actions.changePasswordSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({ success: false, response: error.response });
  }
}

export function* authSaga() {
  yield takeLatest(actions.login.type, login);
  yield takeLatest(actions.logout.type, logout);
  yield takeLatest(actions.forgotPassword.type, forgot);
  yield takeLatest(actions.getUserInfo.type, getUserInfo);
  yield takeLatest(actions.getListEnum.type, getListEnum);
  yield takeLatest(actions.getListProject.type, getListProject);
  yield takeLatest(actions.changePassword.type, changePassword);
  yield takeLatest(actions.resetPassword.type, resetPassword);
  yield takeLatest(actions.updatedAvatarUser.type, updatedAvatarUser);
}
