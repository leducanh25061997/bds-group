import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import notification from 'services/api/notification';
import { FilterParams, Pageable } from 'types';
import { Notify } from 'types/Notification';

import { PayloadReadedNotify } from './types';

import { notifyActions as actions } from '.';

function* getListNotifications(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<Notify> = yield call(
      notification.getListNotifications,
      action.payload,
    );
    yield put(actions.getListNotificationsSuccess(result));
  } catch (errors) {}
}

function* readedNotify(action: PayloadAction<PayloadReadedNotify>) {
  try {
    yield call(notification.readedNotify, action.payload);
  } catch (errors) {}
}

function* readedAllNotify(action: PayloadAction<any>) {
  try {
    yield call(notification.readedAllNotify, action.payload);
    yield put(actions.readedAllNotifySuccess());
  } catch (errors) {}
}

function* checkHasUnreadNotify(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<Notify> = yield call(
      notification.getListNotifications,
      action.payload,
    );
    yield put(actions.checkHasUnreadNotifySuccess(result));
  } catch (errors) {}
}

export function* notifySaga() {
  yield takeLatest(actions.getListNotifications.type, getListNotifications);
  yield takeLatest(actions.readedNotify.type, readedNotify);
  yield takeLatest(actions.readedAllNotify.type, readedAllNotify);
  yield takeLatest(actions.checkHasUnreadNotify.type, checkHasUnreadNotify);
}
