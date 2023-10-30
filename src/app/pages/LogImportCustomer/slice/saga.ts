import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import customer from 'services/api/customer';

import {
  DataLogItem
} from './types';

import { importCustomerActions as actions } from '.';
import { FilterParams, Pageable } from 'types';

function* LogImportCustomerListSagas(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<DataLogItem> = yield call(
      customer.logImportCustomer,
      action.payload,
    );
    yield put(actions.logImportCustomerListSuccess(result));
  } catch (errors) {}
}

export function* LogImportCustomerSaga() {
  yield takeLatest(actions.fetchListLogImportCustomer.type, LogImportCustomerListSagas);
}
