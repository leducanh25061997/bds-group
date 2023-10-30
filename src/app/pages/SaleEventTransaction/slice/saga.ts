import { PayloadAction } from '@reduxjs/toolkit';
import {
  call,
  put,
  takeLatest,
  takeEvery,
  take,
  delay,
} from 'redux-saga/effects';
import transaction from 'services/api/transaction';
import project from 'services/api/project';
import { SignProductParams } from 'types/Project';

import {
  SaleEventTransactionProtype,
  TransactionParams,
  CompleteProfileForm,
  CheckPermissionEventSaleParams,
  PermissionEventSaleProtype,
} from './types';

import { saleEventTransactionActions as actions } from '.';

const reduceFetchData = {
  isPriority: {} as any,
  isFree: {} as any,
};
function* fetchSaleEventTransaction(action: PayloadAction<TransactionParams>) {
  const payload = action.payload.isPriority
    ? reduceFetchData.isPriority
    : reduceFetchData.isFree;

  payload.lastTime = Date.now();
  const cacheTime = payload.lastTime;
  yield delay(500);
  // reject old request if have new request (between 500ms)
  if (payload.lastTime !== cacheTime) {
    return;
  }
  yield fetchSaleEventTransactionBySchedule(action);
  if (action.payload.isPriority) {
    reduceFetchData.isPriority = {
      ...action.payload,
      lastTime: Date.now(),
    };
  } else {
    reduceFetchData.isFree = {
      ...action.payload,
      lastTime: Date.now(),
    };
  }
}

function* fetchSaleEventTransactionBySchedule(
  action: PayloadAction<TransactionParams>,
) {
  try {
    const result: SaleEventTransactionProtype = yield call(
      transaction.fetchTransaction,
      action.payload,
    );
    if (action.payload.isPriority) {
      yield put(actions.fetchSaleEventTransactionPrioritySuccess(result));
    } else {
      yield put(actions.fetchSaleEventTransactionFreeSuccess(result));
    }
  } catch (error) {
    if (action.payload.isPriority) {
      yield put(actions.fetchSaleEventTransactionFreeFaild());
    } else {
      yield put(actions.fetchSaleEventTransactionPriorityFaild);
    }
  }
}

function* completeProfile(
  action: PayloadAction<CompleteProfileForm, string, (error?: any) => void>,
) {
  try {
    yield call(transaction.completeProfile, action.payload);
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* addProfile(
  action: PayloadAction<CompleteProfileForm, string, (error?: any) => void>,
) {
  try {
    yield call(transaction.addProfile, action.payload);
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
    console.log(error, 'error');
  }
}

function* creteProductCustomer(
  action: PayloadAction<any, string, (error?: any) => void>,
) {
  try {
    yield call(project.creteProductCustomer, action.payload);
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* signProduct(
  action: PayloadAction<SignProductParams, string, (error?: any) => void>,
) {
  try {
    yield call(project.SignProduct, action.payload);
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      message: error.response.data.message,
    });
  }
}

function* returnProduct(
  action: PayloadAction<SignProductParams, string, (error?: any) => void>,
) {
  try {
    yield call(project.returnProduct, action.payload);
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      message: error.response.data.message,
    });
  }
}

function* fetchPermissionEventSale(
  action: PayloadAction<CheckPermissionEventSaleParams>,
) {
  try {
    const result: PermissionEventSaleProtype = yield call(
      transaction.checkPermissionEventSale,
      action.payload,
    );
    yield put(actions.fetchPermissionEventSaleSuccess(result));
  } catch (error) {
    console.log(error);
  }
}

export function* SaleEventTransactionSaga() {
  yield takeEvery(
    actions.fetchSaleEventTransaction.type,
    fetchSaleEventTransaction,
  );
  yield takeLatest(actions.completeProfile.type, completeProfile);
  yield takeLatest(actions.addProfile.type, addProfile);
  yield takeLatest(actions.creteProductCustomer.type, creteProductCustomer);
  yield takeLatest(actions.signProduct.type, signProduct);
  yield takeLatest(actions.returnProduct.type, returnProduct);
  yield takeLatest(
    actions.fetchPermissionEventSale.type,
    fetchPermissionEventSale,
  );
}
