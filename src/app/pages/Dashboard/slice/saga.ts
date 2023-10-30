import { put, takeLatest } from 'redux-saga/effects';

import { dashboardAction as actions } from '.';

function* getBooleanInfomation(action: any) {
  try {
    const result = action.payload;
    yield put(actions.hasInformationSuccess(result));
  } catch (errors) {}
}

export function* dashboardSaga() {
  yield takeLatest(actions.hasInformationSuccess.type, getBooleanInfomation);
}
