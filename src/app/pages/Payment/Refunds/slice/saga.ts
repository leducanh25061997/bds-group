import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import payment from 'services/api/payment';
import { Pageable } from 'types';
import { refundsActions as actions } from '.';
import { ApproveRefundRequest, CancelRefundRequest, FilterRefunds, RefundsResponse } from './types';

function* fetchRefundWaiting(action: PayloadAction<FilterRefunds>) {
  try {
    const result: Pageable<RefundsResponse> = yield call(
      payment.fetchRefunds,
      action.payload,
    );
    yield put(actions.fetchRefundWaitingSuccess(result));
  } catch (error) {
    yield put(actions.fetchRefundWaitingFaild());
    console.log(error, 'error');
  }
}

function* fetchRefundApprove(action: PayloadAction<FilterRefunds>) {
  try {
    const result: Pageable<RefundsResponse> = yield call(
      payment.fetchRefunds,
      action.payload,
    );
    yield put(actions.fetchRefundApproveSuccess(result));
  } catch (error) {
    yield put(actions.fetchRefundApproveFaild());
    console.log(error, 'error');
  }
}

function* fetchRefundInformation(action: PayloadAction<string>) {
  try {
    const result: RefundsResponse = yield call(
      payment.fetchRefundInformation,
      action.payload,
    );
    yield put(actions.fetchRefundInformationSuccess(result));
  } catch (error) {
    yield put(actions.fetchRefundInformationFaild());
  }
}

function* approveRefundFormData(
  action: PayloadAction<ApproveRefundRequest, string, (error?: any) => void>,
) {
  try {
    yield call(payment.approveRefundFormData, action.payload);
    yield put(actions.approveRefundFormDataSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* cancelRefundFormData(
  action: PayloadAction<CancelRefundRequest, string, (error?: any) => void>,
) {
  try {
    yield call(payment.cancelRefund, action.payload);
    yield put(actions.cancelRefundFormDataSuccess());
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

export function* refundsSaga() {
  yield takeLatest(actions.fetchRefundWaiting.type, fetchRefundWaiting);
  yield takeLatest(actions.fetchRefundApprove.type, fetchRefundApprove);
  yield takeLatest(actions.approveRefundFormData.type, approveRefundFormData);
  yield takeLatest(actions.fetchRefundInformation.type, fetchRefundInformation);
  yield takeLatest(actions.cancelRefundFormData.type, cancelRefundFormData);
}
