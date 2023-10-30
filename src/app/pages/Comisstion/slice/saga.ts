import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import Comisstion from 'services/api/comisstion';
import { FilterParams, Pageable } from 'types';
import { ComisstionItem, UPloadComisstion } from 'types/User';

import {
  PayloadUpdateStatusComisstion,
  PayloadGetDetailComisstion,
  PayloadCreateComisstion,
  RoleData,
  PayloadUpdateComisstion,
  WorkDoneData,
  PayloadGetTotalContractThisQuarter,
  PayloadManagerment,
} from './types';

import { ComisstionActions as actions } from '.';

function* fetchListComisstionSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<UPloadComisstion> = yield call(
      Comisstion.fetchListComisstion,
      action.payload,
    );
    yield put(actions.fetchListComisstionSuccess(result));
  } catch (errors) {}
}

function* updateStatusComisstion(
  action: PayloadAction<
    PayloadUpdateStatusComisstion,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Comisstion.updateStatusComisstion, action.payload);
    yield put(actions.updateStatusComisstionSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* getDetailComisstion(
  action: PayloadAction<PayloadGetDetailComisstion>,
) {
  try {
    const result: ComisstionItem = yield call(
      Comisstion.getDetailComisstion,
      action.payload,
    );
    yield put(actions.getDetailComisstionSuccess(result));
  } catch (errors) {}
}

function* createComisstion(
  action: PayloadAction<PayloadCreateComisstion, string, (error?: any) => void>,
) {
  try {
    yield call(Comisstion.createComisstion, action.payload);
    yield put(actions.createComisstionSuccess());
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

function* fetchRoleList() {
  try {
    const result: RoleData[] = yield call(Comisstion.fetchRoleList);
    yield put(actions.fetchRoleListSuccess(result));
  } catch (errors) {}
}

function* updateDataComisstion(
  action: PayloadAction<PayloadUpdateComisstion, string, (error?: any) => void>,
) {
  try {
    yield call(Comisstion.updateDataComisstion, action.payload);
    yield put(actions.updateDataComisstionSuccess());
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

function* getStaffList(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ComisstionItem> = yield call(
      Comisstion.fetchListComisstion,
      action.payload,
    );
    yield put(actions.getStaffListSuccess(result));
  } catch (errors) {}
}

function* getWorkDoneData(action: PayloadAction<PayloadManagerment>) {
  try {
    const result: WorkDoneData = yield call(
      Comisstion.fetchListManagement,
      action.payload,
    );
    yield put(actions.getWorkDoneDataSuccess(result));
  } catch (errors) {}
}

function* getManager1List(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ComisstionItem> = yield call(
      Comisstion.fetchListComisstion,
      action.payload,
    );
    yield put(actions.getManager1ListSuccess(result));
  } catch (errors) {}
}

function* getManager2List(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ComisstionItem> = yield call(
      Comisstion.fetchListComisstion,
      action.payload,
    );
    yield put(actions.getManager2ListSuccess(result));
  } catch (errors) {}
}


export function* ComisstionSaga() {
  yield takeLatest(actions.fetchListComisstion.type, fetchListComisstionSaga);
  yield takeLatest(actions.updateStatusComisstion.type, updateStatusComisstion);
  yield takeLatest(actions.getDetailComisstion.type, getDetailComisstion);
  yield takeLatest(actions.createComisstion.type, createComisstion);
  yield takeLatest(actions.fetchRoleList.type, fetchRoleList);
  yield takeLatest(actions.updateDataComisstion.type, updateDataComisstion);
  yield takeLatest(actions.getStaffList.type, getStaffList);
  yield takeLatest(actions.getManager1List.type, getManager1List);
  yield takeLatest(actions.getManager2List.type, getManager2List);
  yield takeLatest(actions.getWorkDoneData.type, getWorkDoneData);
}
