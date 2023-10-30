import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  ApproveReceiptRequest,
  CancelReceiptRequest,
  FilterReceipts,
  ReceiptsResponse,
} from './types';

import { receiptsActions as actions } from '.';
import payment from 'services/api/payment';
import { Pageable } from 'types';

function* fetchReceiptsApprove(action: PayloadAction<FilterReceipts>) {
  try {
    const result: Pageable<ReceiptsResponse> = yield call(
      payment.fetchReceipts,
      action.payload,
    );
    yield put(actions.fetchReceiptsApproveSuccess(result));
  } catch (error) {
    yield put(actions.fetchReceiptsApproveFaild());
    console.log(error, 'error');
  }
}

function* fetchReceiptInformation(action: PayloadAction<string>) {
  try {
    const result: ReceiptsResponse = yield call(
      payment.fetchReceiptInformation,
      action.payload,
    );
    yield put(actions.fetchReceiptInformationSuccess(result));
  } catch (error) {
    yield put(actions.fetchReceiptInformationFaild());
  }
}

function* approveReceiptFormData(
  action: PayloadAction<ApproveReceiptRequest, string, (error?: any) => void>,
) {
  try {
    yield call(payment.approveReceiptFormData, action.payload);
    yield put(actions.approveReceiptFormDataSuccess());
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

function* cancelReceiptFormData(
  action: PayloadAction<CancelReceiptRequest, string, (error?: any) => void>,
) {
  try {
    yield call(payment.cancelReceipt, action.payload);
    yield put(actions.cancelReceiptFormDataSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* fetchReceiptsApproveNoLoading(action: PayloadAction<FilterReceipts>) {
  try {
    const result: Pageable<ReceiptsResponse> = yield call(
      payment.fetchReceipts,
      action.payload,
    );
    yield put(actions.fetchReceiptsApproveNoLoadingSuccess(result));
  } catch (error) {
    yield put(actions.fetchReceiptsApprovesNoLoadingFaild());
    console.log(error, 'error');
  }
}

function* fetchReceiptsWaitting(action: PayloadAction<FilterReceipts>) {
  try {
    const result: Pageable<ReceiptsResponse> = yield call(
      payment.fetchReceipts,
      action.payload,
    );
    yield put(actions.fetchReceiptsWaittingSuccess(result));
  } catch (error) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchReceiptsWaittingFaild(defaultObjectErrorReturn));
  }
}

function* fetchReceiptsWaittingNoLoading(
  action: PayloadAction<FilterReceipts>,
) {
  try {
    const result: Pageable<ReceiptsResponse> = yield call(
      payment.fetchReceipts,
      action.payload,
    );
    yield put(actions.fetchReceiptsWaittingNoLoadingSuccess(result));
  } catch (error) {
    yield put(actions.fetchReceiptsWaittingNoLoadingFaild());
    console.log(error, 'error');
  }
}

export function* receiptsSaga() {
  yield takeLatest(actions.fetchReceiptsApprove.type, fetchReceiptsApprove);
  yield takeLatest(actions.fetchReceiptsWaitting.type, fetchReceiptsWaitting);
  yield takeLatest(
    actions.fetchReceiptInformation.type,
    fetchReceiptInformation,
  );
  yield takeLatest(actions.approveReceiptFormData.type, approveReceiptFormData);
  yield takeLatest(actions.cancelReceiptFormData.type, cancelReceiptFormData);
  yield takeLatest(
    actions.fetchReceiptsApproveNoLoading.type,
    fetchReceiptsApproveNoLoading,
  );
  yield takeLatest(
    actions.fetchReceiptsWaittingNoLoading.type,
    fetchReceiptsWaittingNoLoading,
  );
}
