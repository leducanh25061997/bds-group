import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { call, put, takeLatest } from 'redux-saga/effects';
import Mission from 'services/api/mission';

import {
  MissionAssignedItem,
  PayloadCreateKpiMission,
  PayloadGetDetailKpiMission,
  PayloadGetStatisticKpi,
  PayloadUpdateKpiMission,
  StatisticKpiItem,
} from './types';

import { kpiMissionActions as actions } from '.';

function* fetchListMissionAssigned(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<any> = yield call(
      Mission.fetchListMissionAssigned,
      action.payload,
    );
    yield put(actions.fetchListMissionAssignedSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(
      actions.fetchListMissionAssignedSuccess(defaultObjectErrorReturn),
    );
  }
}

function* createKpiMission(
  action: PayloadAction<PayloadCreateKpiMission, string, (error?: any) => void>,
) {
  try {
    yield call(Mission.createKpiMission, action.payload);
    yield put(actions.createKpiMissionSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    yield put(actions.createKpiMissionSuccess());
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}

function* getDetailKpiMission(
  action: PayloadAction<PayloadGetDetailKpiMission>,
) {
  try {
    const result: MissionAssignedItem = yield call(
      Mission.getDetailKpiMission,
      action.payload,
    );
    yield put(actions.getDetailKpiMissionSuccess(result));
  } catch (errors) {}
}

function* updateKpiMission(
  action: PayloadAction<PayloadUpdateKpiMission, string, (error?: any) => void>,
) {
  try {
    yield call(Mission.updateKpiMission, action.payload);
    yield put(actions.updateKpiMissionSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    yield put(actions.updateKpiMissionSuccess());
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}

function* getListStatisticKpi(action: PayloadAction<PayloadGetStatisticKpi>) {
  try {
    const result: MissionAssignedItem = yield call(
      Mission.getListStatisticKpi,
      action.payload,
    );
    yield put(actions.getListStatisticKpiSuccess(result));
  } catch (errors) {}
}

function* getHandleKpiMission(
  action: PayloadAction<
    PayloadGetDetailKpiMission,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Mission.getHandleKpiMission, action.payload);
    yield put(actions.getHandleKpiMissionSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    yield put(actions.getHandleKpiMissionSuccess());
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}

function* getListDetailStatisticKpi(
  action: PayloadAction<PayloadGetStatisticKpi>,
) {
  try {
    const result: MissionAssignedItem = yield call(
      Mission.getListStatisticKpi,
      action.payload,
    );
    yield put(actions.getListDetailStatisticKpiSuccess(result));
  } catch (errors) {}
}

export function* kpiMissionSaga() {
  yield takeLatest(
    actions.fetchListMissionAssigned.type,
    fetchListMissionAssigned,
  );
  yield takeLatest(actions.createKpiMission.type, createKpiMission);
  yield takeLatest(actions.getDetailKpiMission.type, getDetailKpiMission);
  yield takeLatest(actions.updateKpiMission.type, updateKpiMission);
  yield takeLatest(actions.getListStatisticKpi.type, getListStatisticKpi);
  yield takeLatest(actions.getHandleKpiMission.type, getHandleKpiMission);
  yield takeLatest(
    actions.getListDetailStatisticKpi.type,
    getListDetailStatisticKpi,
  );
}
