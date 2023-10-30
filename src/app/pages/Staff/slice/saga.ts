import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import Staff from 'services/api/staff';
import { FilterParams, Pageable } from 'types';
import { StaffItem } from 'types/Staff';

import {
  PayloadCreateStaff,
  PayloadGetDetailStaff,
  PayloadUpdateStaff,
} from './types';

import { StaffActions as actions } from '.';

function* fetchListStaffSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<StaffItem> = yield call(
      Staff.fetchListStaff,
      action.payload,
    );
    yield put(actions.fetchListStaffSuccess(result));
  } catch (errors) {}
}

function* createStaffSaga(
  action: PayloadAction<PayloadCreateStaff, string, (error?: any) => void>,
) {
  try {
    yield call(Staff.createStaff, action.payload);
    yield put(actions.createStaffSuccess());
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

function* getDetailStaffSaga(action: PayloadAction<PayloadGetDetailStaff>) {
  try {
    const result: StaffItem = yield call(Staff.getDetailStaff, action.payload);
    yield put(actions.getDetailStaffSuccess(result));
  } catch (errors) {}
}

function* updateDataStaff(
  action: PayloadAction<PayloadUpdateStaff, string, (error?: any) => void>,
) {
  try {
    yield call(Staff.updateDataStaff, action.payload);
    yield put(actions.updateDataStaffSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

export function* StaffSaga() {
  yield takeLatest(actions.fetchListStaff.type, fetchListStaffSaga);
  yield takeLatest(actions.createStaff.type, createStaffSaga);
  yield takeLatest(actions.getDetailStaff.type, getDetailStaffSaga);
  yield takeLatest(actions.updateDataStaff.type, updateDataStaff);
}
