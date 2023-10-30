import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import { Task } from 'redux-saga';
import EventSales from 'services/api/eventSales';
import SalesProgram from 'services/api/salesProgram';
import { PayloadGetOrgtChart } from 'app/pages/SalesProgram/slice/types';
import { OrgChart } from 'types';

import {
  EventPermission,
  EventReport,
  EventSalesInfo,
  Notifications,
  PayloadCheckEventPermission,
  PayloadGetNotification,
  PayloadGetReport,
} from './types';

import { saleEventControlActions as actions } from '.';

function* fetchEventSales(action: PayloadAction<{ id: string }>) {
  try {
    const result: EventSalesInfo = yield call(
      EventSales.fetchEventSales,
      action.payload,
    );
    yield put(actions.fetchEventSalesInfoSuccess(result));
  } catch (errors) {}
}

function* getOrgChart(action: PayloadAction<PayloadGetOrgtChart>) {
  try {
    const result: OrgChart[] = yield call(
      SalesProgram.getOrgChart,
      action.payload,
    );
    yield put(actions.getOrgChartSuccess(result));
  } catch (errors) {}
}

function* getNotification(action: PayloadAction<PayloadGetNotification>) {
  try {
    const result: Notifications = yield call(
      EventSales.getNotification,
      action.payload,
    );
    yield put(actions.getNotificationSuccess(result));
  } catch (errors) {}
}

function* intervalGetEventReport(action: PayloadAction<PayloadGetReport>) {
  try {
    const task: Task = yield fork(getEventReport, action);
    yield takeLatest(actions.clearEventReport.type, () => {
      task.cancel();
    });
  } catch (errors) {}
}

function* getEventReport(action: PayloadAction<PayloadGetReport>) {
  // trigger every 5 seconds
  while (true) {
    try {
      const result: EventReport = yield call(
        EventSales.getReport,
        action.payload,
      );
      yield put(actions.getEventReportSuccess(result));
    } catch (errors) {}
    yield delay(5000);
  }
}

function* checkEventSalesPermission(
  action: PayloadAction<PayloadCheckEventPermission>,
) {
  try {
    const result: EventPermission = yield call(
      EventSales.checkEventPermission,
      action.payload,
    );
    yield put(actions.checkEventSalesPermissionSuccess(result));
  } catch (errors) {}
}

export function* SaleEventControlSaga() {
  yield takeLatest(actions.fetchEventSalesInfo.type, fetchEventSales);
  yield takeLatest(actions.getOrgChart.type, getOrgChart);
  yield takeLatest(actions.getNotification.type, getNotification);
  yield takeLatest(actions.getEventReport.type, intervalGetEventReport);
  yield takeLatest(
    actions.checkEventSalesPermission.type,
    checkEventSalesPermission,
  );
}
