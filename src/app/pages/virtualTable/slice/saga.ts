import { PayloadAction } from '@reduxjs/toolkit';
import { ProductDataTable, SettingTableProduct } from 'types/ProductTable';
import { call, takeLatest, put } from 'redux-saga/effects';
import Transaction from 'services/api/transaction';
import { virtualTableActions as actions } from '.';
import { ProductTableParams } from 'types/ProductTable';
import { UpdateVirtualStatusParams } from './types';

function* fetchSettingTableProduct(
  action: PayloadAction<ProductTableParams>,
) {
  try {
    const result: SettingTableProduct[] = yield call(
      Transaction.fetchSettingTableProduct,
      action.payload,
    );
    yield put(actions.fetchSettingTableProductSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* fetchDatatable(action: PayloadAction<ProductTableParams>) {
  try {
    const result: ProductDataTable = yield call(
      Transaction.fetchDatatable,
      action.payload,
    );
    yield put(actions.fetchDatatableSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* updateVirtualStatus(
  action: PayloadAction<
  UpdateVirtualStatusParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Transaction.updateVirtualStatus, action.payload);
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}


export function* virtualTableSaga() {
  yield takeLatest(
    actions.fetchSettingTableProduct.type,
    fetchSettingTableProduct,
  );
  yield takeLatest(
    actions.fetchDatatable.type,
    fetchDatatable,
  );
  yield takeLatest(
    actions.updateVirtualStatus.type,
    updateVirtualStatus,
  );
}
