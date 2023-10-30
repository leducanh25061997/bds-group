import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import ProductTable from 'services/api/productTable';

import {
  PayloadUploadGroundProductTable,
  PayloadUploadProductTable,
} from 'app/pages/ProductTableSetting/slice/types';

import { GroundProductTableData } from './types';

import { groundProductTableActions as actions } from '.';

function* getGroundProductTable(
  action: PayloadAction<{ id: string }, string, (error?: any) => void>,
) {
  try {
    const result: GroundProductTableData = yield call(
      ProductTable.getGroundProductTable,
      action.payload,
    );

    yield put(actions.getGroundProductTableSuccess(result));
    action.meta &&
      action?.meta({
        success: true,
      });
  } catch (error: any) {
    action.meta &&
      action?.meta({
        success: false,
        response: error.response,
      });
  }
}

function* createGroundProductTable(
  action: PayloadAction<
    PayloadUploadGroundProductTable,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(ProductTable.createGroundProductTable, action.payload);
    // yield put(actions.createTicketReservationSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      action.meta({
        success: false,
        code: error.code,
        response: error.response,
      });
    }
  }
}

export function* groundProductTableSaga() {
  yield takeLatest(actions.getGroundProductTable.type, getGroundProductTable);
  yield takeLatest(
    actions.createGroundProductTable.type,
    createGroundProductTable,
  );
}
