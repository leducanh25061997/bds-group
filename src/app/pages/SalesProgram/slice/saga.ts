import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import SalesProgram from 'services/api/salesProgram';
import { FilterParams, Pageable } from 'types';
import { salesProgramActions as actions } from '.';
import {
  FilterProduct,
  PayloadGetDetailSalesProgram,
  PayloadSalesProgram,
  PayloadUpdateSalesProgram,
  PayloadUpdateStatusSalesProgram,
  ProductItem,
  SalesProgramItem,
} from './types';

function* fetchListSalesProgram(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<SalesProgramItem> = yield call(
      SalesProgram.fetchListSalesProgram,
      action.payload,
    );
    if (action.payload.type) {
      yield put(actions.fetchListSalesProgramPrioritySuccess(result));
    } else {
      yield put(actions.fetchListSalesProgramSuccess(result));
    }
    // 

    
  } catch (errors) {}
}

function* fetchListProduct(action: PayloadAction<FilterProduct>) {
  try {
    const result: ProductItem[] = yield call(
      SalesProgram.fetchListProduct,
      action.payload,
    );
    yield put(actions.fetchListProductSuccess(result));
  } catch (errors) {}
}

function* createSalesProgram(
  action: PayloadAction<PayloadSalesProgram, string, (error?: any) => void>,
) {
  try {
    yield call(SalesProgram.createSalesProgram, action.payload);
    yield put(actions.createSalesProgramSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    console.log('error', error);

    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* updateStatusSalesProgram(
  action: PayloadAction<
    PayloadUpdateStatusSalesProgram,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(SalesProgram.updateStatusSalesProgram, action.payload);
    yield put(actions.updateStatusSalesProgramSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* actionPriceSalesProgram(
  action: PayloadAction<
    PayloadUpdateStatusSalesProgram,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(SalesProgram.actionPriceSalesProgram, action.payload);
    yield put(actions.actionPriceSalesProgramSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* getDetailSalesProgram(
  action: PayloadAction<PayloadGetDetailSalesProgram>,
) {
  try {
    const result: SalesProgramItem = yield call(
      SalesProgram.getDetailSalesProgram,
      action.payload,
    );
    yield put(actions.getDetailSalesProgramSuccess(result));
  } catch (errors) {}
}

function* updateDataSalesProgram(
  action: PayloadAction<
    PayloadUpdateSalesProgram,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(SalesProgram.updateDataSalesProgram, action.payload);
    yield put(actions.updateSalesProgramSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* deleteSalesProgram(
  action: PayloadAction<
    PayloadGetDetailSalesProgram,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(SalesProgram.deleteSalesProgram, action.payload);
    yield put(actions.deleteSalesProgramSuccess());
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

export function* SalesProgramSaga() {
  yield takeLatest(actions.fetchListSalesProgram.type, fetchListSalesProgram);
  yield takeLatest(actions.createSalesProgram.type, createSalesProgram);
  yield takeLatest(actions.getDetailSalesProgram.type, getDetailSalesProgram);
  yield takeLatest(actions.fetchListProduct.type, fetchListProduct);
  yield takeLatest(actions.deleteSalesProgram.type, deleteSalesProgram);
  yield takeLatest(actions.updateDataSalesProgram.type, updateDataSalesProgram);
  yield takeLatest(
    actions.actionPriceSalesProgram.type,
    actionPriceSalesProgram,
  );
  yield takeLatest(
    actions.updateStatusSalesProgram.type,
    updateStatusSalesProgram,
  );
}
