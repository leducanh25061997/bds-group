import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import Orgchart from 'services/api/orgchart';
import { FilterParams, Pageable } from 'types';
import { OrgchartItem } from 'types/Orgchart';


import { StaffItem } from 'types/Staff';

import {
  PayloadCreateOrgchart,
  PayloadGetDetailOrgchart,
  PayloadGetStaffOrgchart,
  PayloadUpdateOrgchart
} from './types';

import { customerActions as actions } from '.';

function* fetchListOrgchart() {
  try {
    const result: Pageable<OrgchartItem> = yield call(
      Orgchart.fetchListOrgchart,
    );
    yield put(actions.fetchListOrgchartSuccess(result));
  } catch (errors) {}
}

function* fetchListStaffOrgchart(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<StaffItem> = yield call(
      Orgchart.fetchListStaffOrgchart,
      action.payload,
    );
    yield put(actions.fetchListStaffOrgchartSuccess(result));
  } catch (errors) {}
}

function* fetchListOrgchartFilterSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<OrgchartItem> = yield call(
      Orgchart.fetchListOrgchartFilter,
      action.payload,
    );
    yield put(actions.fetchListOrgchartFilterSuccess(result));
  } catch (errors) {}
}

function* getStaffNoneOrgchart() {
  try {
    const result: Pageable<StaffItem> = yield call(
      Orgchart.getStaffNoneOrgchart,
    );
    yield put(actions.getStaffNoneOrgchartSuccess(result));
  } catch (errors) {}
}

function* createOrgchart(
  action: PayloadAction<PayloadCreateOrgchart, string, (error?: any) => void>,
) {
  try {
    yield call(Orgchart.createOrgchart, action.payload);
    yield put(actions.createOrgchartSuccess());
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


function* getDetailOrgchart(action: PayloadAction<PayloadGetDetailOrgchart>) {
  try {
    const result: OrgchartItem = yield call(
      Orgchart.getDetailOrgchart,
      action.payload,
    );
    yield put(actions.getDetailOrgchartSuccess(result));
  } catch (errors) {}
}

function* updateDataOrgchart(
  action: PayloadAction<PayloadUpdateOrgchart, string, (error?: any) => void>,
) {
  try {
    yield call(Orgchart.updateOrgchart, action.payload);
    yield put(actions.updateDataOrgchartSuccess());
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


export function* OrgchartSaga() {
  yield takeLatest(actions.fetchListOrgchart.type, fetchListOrgchart);
  yield takeLatest(actions.fetchListStaffOrgchart.type, fetchListStaffOrgchart);
  yield takeLatest(actions.fetchListOrgchartFilter.type, fetchListOrgchartFilterSaga);
  yield takeLatest(actions.createOrgchart.type, createOrgchart);
  yield takeLatest(actions.getDetailOrgchart.type, getDetailOrgchart);
  yield takeLatest(actions.updateDataOrgchart.type, updateDataOrgchart);
  yield takeLatest(actions.getStaffNoneOrgchart.type, getStaffNoneOrgchart);
}
