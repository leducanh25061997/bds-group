import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import customer from 'services/api/customer';
import { FilterParams, Pageable } from 'types';
import { CustomerItem } from 'types/User';

import {
  PayloadAppraisalCustomer,
  PayloadApproveAction,
  PayloadCreateActivity,
  PayloadCreateCustomer,
  PayloadGetDetailCustomer,
  PayloadSendApproveCustomer,
  PayloadSentApprove,
  PayloadUpdateCustomer,
  PayloadUpdateStatusCustomer,
} from './types';

import { customerActions as actions } from '.';

function* fetchListCustomerSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<CustomerItem> = yield call(
      customer.fetchListCustomer,
      action.payload,
    );
    yield put(actions.fetchListCustomerSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListCustomerSuccess(defaultObjectErrorReturn));
  }
}

function* fetchListCustomerTransSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<CustomerItem> = yield call(
      customer.fetchListCustomerTrans,
      action.payload,
    );
    yield put(actions.fetchListCustomerTransacionSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(
      actions.fetchListCustomerTransacionSuccess(defaultObjectErrorReturn),
    );
  }
}

function* fetchListCustomerInTicketSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<CustomerItem> = yield call(
      customer.fetchListCustomerInTicket,
      action.payload,
    );
    yield put(actions.fetchListCustomerInTicketSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(
      actions.fetchListCustomerInTicketSuccess(defaultObjectErrorReturn),
    );
  }
}

function* updateStatusCustomer(
  action: PayloadAction<
    PayloadUpdateStatusCustomer,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(customer.updateStatusCustomer, action.payload);
    yield put(actions.updateStatusCustomerSuccess());
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

function* getDetailCustomer(action: PayloadAction<PayloadGetDetailCustomer>) {
  try {
    const result: CustomerItem = yield call(
      customer.getDetailCustomer,
      action.payload,
    );
    yield put(actions.getDetailCustomerSuccess(result));
  } catch (errors) {}
}

function* createCustomer(
  action: PayloadAction<PayloadCreateCustomer, string, (error?: any) => void>,
) {
  try {
    yield call(customer.createCustomer, action.payload);
    yield put(actions.createCustomerSuccess());
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

function* updateDataCustomer(
  action: PayloadAction<PayloadUpdateCustomer, string, (error?: any) => void>,
) {
  try {
    yield call(customer.updateDataCustomer, action.payload);
    yield put(actions.updateDataCustomerSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* sendApproveCustomerSagas(
  action: PayloadAction<PayloadSentApprove, string, (error?: any) => void>,
) {
  try {
    yield call(customer.sendApproveCustomer, action.payload);
    yield put(actions.sendApproveCustomerSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* updateApproveCustomerSagas(
  action: PayloadAction<PayloadApproveAction, string, (error?: any) => void>,
) {
  try {
    yield call(customer.updateApproveCustomer, action.payload);
    yield put(actions.updateApproveCustomerSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* createActivityCustomer(
  action: PayloadAction<PayloadCreateActivity, string, (error?: any) => void>,
) {
  try {
    yield call(customer.createActivityCustomer, action.payload);
    yield put(actions.createActivityCustomerSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* searchingCustomerList(
  action: PayloadAction<FilterParams, string, (error?: any) => void>,
) {
  try {
    const result: Pageable<CustomerItem> = yield call(
      customer.fetchListCustomer,
      action.payload,
    );
    yield put(actions.searchingCustomerListSuccess());
    action.meta({
      success: true,
      response: result,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* appraisalCustomer(
  action: PayloadAction<
    PayloadAppraisalCustomer,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(customer.appraisalCustomer, action.payload);
    yield put(actions.appraisalCustomerSuccess());
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

export function* customerSaga() {
  yield takeLatest(actions.fetchListCustomer.type, fetchListCustomerSaga);
  yield takeLatest(
    actions.fetchListCustomerTransacion.type,
    fetchListCustomerTransSaga,
  );
  yield takeLatest(actions.updateStatusCustomer.type, updateStatusCustomer);
  yield takeLatest(actions.getDetailCustomer.type, getDetailCustomer);
  yield takeLatest(actions.createCustomer.type, createCustomer);
  yield takeLatest(actions.updateDataCustomer.type, updateDataCustomer);
  yield takeLatest(actions.sendApproveCustomer.type, sendApproveCustomerSagas);
  yield takeLatest(actions.updateApproveCustomer.type, updateApproveCustomerSagas);
  yield takeLatest(actions.searchingCustomerList.type, searchingCustomerList);
  yield takeLatest(actions.createActivityCustomer.type, createActivityCustomer);
  yield takeLatest(
    actions.fetchListCustomerInTicket.type,
    fetchListCustomerInTicketSaga,
  );
  yield takeLatest(actions.appraisalCustomer.type, appraisalCustomer);
}
