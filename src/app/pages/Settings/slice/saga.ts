import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import contract from 'services/api/contract';
import { FilterParams, Pageable } from 'types';
import {
  PermisstionItem,
  RoleDetailItem,
  RoleItem,
  User,
} from 'types/Contract';
import { PropertyType } from 'types/Property';

import {
  PayloadCreatePermission,
  PayloadGetDetailRoles,
  PayloadUpdateRoles,
  PayloadUpdateUserRoles,
} from './types';

import { contractActions as actions } from '.';

function* fetchListPermissionSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<PermisstionItem> = yield call(
      contract.fetchListPermission,
      action.payload,
    );
    yield put(actions.fetchListPermissionSuccess(result));
  } catch (errors) {}
}

function* fetchListUsersSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<User> = yield call(
      contract.fetchListUsers,
      action.payload,
    );
    yield put(actions.fetchListUserSuccess(result));
  } catch (errors) {}
}

function* fetchListRoleSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<RoleItem> = yield call(
      contract.fetchListRoles,
      action.payload,
    );
    yield put(actions.fetchListRoleSuccess(result));
  } catch (errors) {}
}

function* createPermissionSaga(
  action: PayloadAction<PayloadCreatePermission, string, (error?: any) => void>,
) {
  try {
    yield call(contract.createPermission, action.payload);
    yield put(actions.createRolesSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* fetchListRolesDetailSaga(action: PayloadAction<RoleDetailItem>) {
  try {
    const result: RoleDetailItem = yield call(
      contract.fetchListRolesDetail,
      action.payload,
    );
    yield put(actions.getRoleDetailSuccess(result));
  } catch (errors) {}
}

function* updateDataRolesSaga(
  action: PayloadAction<PayloadUpdateRoles, string, (error?: any) => void>,
) {
  try {
    yield call(contract.updateDataRoles, action.payload);
    yield put(actions.updateDataRolesSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* updateDataUserRolesSaga(
  action: PayloadAction<PayloadUpdateUserRoles, string, (error?: any) => void>,
) {
  try {
    yield call(contract.updateDataUserRoles, action.payload);
    yield put(actions.updateDataUserRolesSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* deleteDataUserRolesSaga(
  action: PayloadAction<PayloadGetDetailRoles, string, (error?: any) => void>,
) {
  try {
    yield call(contract.deleteDataUserRoles, action.payload);
    yield put(actions.deleteUserRolesSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

export function* contractSaga() {
  yield takeLatest(actions.fetchListPermission.type, fetchListPermissionSaga);
  yield takeLatest(actions.fetchListRole.type, fetchListRoleSaga);
  yield takeLatest(actions.createRoles.type, createPermissionSaga);
  yield takeLatest(actions.getRoleDetail.type, fetchListRolesDetailSaga);
  yield takeLatest(actions.updateDataRoles.type, updateDataRolesSaga);
  yield takeLatest(actions.updateDataUserRoles.type, updateDataUserRolesSaga);
  yield takeLatest(actions.deleteUserRoles.type, deleteDataUserRolesSaga);
  yield takeLatest(actions.fetchListUser.type, fetchListUsersSaga);
}
