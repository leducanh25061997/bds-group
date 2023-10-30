import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import LeadApi from 'services/api/lead';
import { FilterParams, Pageable } from 'types';

import { FileImport, LeadItem, PayloadLeadAllotment, PayloadUpdateLead, PayloadUpdateLeadSegment, Segment } from './types';

import { leadActions as actions } from '.';

function* fetchListLeadSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<LeadItem> = yield call(
      LeadApi.fetchListLead,
      action.payload,
    );
    yield put(actions.fetchListLeadSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListLeadSuccess(defaultObjectErrorReturn));
  }
}

function* fetchListLeadTakeCareSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<LeadItem> = yield call(
      LeadApi.fetchListLeadTakeCare,
      action.payload,
    );
    yield put(actions.fetchListLeadTakeCareSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListLeadTakeCareSuccess(defaultObjectErrorReturn));
  }
}

function* fetchListLeadAllotmentSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<LeadItem> = yield call(
      LeadApi.fetchListLeadAllotment,
      action.payload,
    );
    yield put(actions.fetchListLeadAllotmentSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListLeadAllotmentSuccess(defaultObjectErrorReturn));
  }
}

function* fetchListLeadAllotedSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<LeadItem> = yield call(
      LeadApi.fetchListLeadAlloted,
      action.payload,
    );
    yield put(actions.fetchListLeadAllotedSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListLeadAllotedSuccess(defaultObjectErrorReturn));
  }
}

function* getSegmentSaga() {
  try {
    const result: Segment[] = yield call(LeadApi.getSegment);
    yield put(actions.getSegmentSuccess(result));
  } catch (error: any) {}
}

function* getFileImportSaga() {
  try {
    const result: FileImport[] = yield call(LeadApi.getFileImport);
    yield put(actions.getFileImportSuccess(result));
  } catch (error: any) {}
}

function* updateLeadSegment(
  action: PayloadAction<PayloadUpdateLeadSegment, string, (error?: any) => void>,
) {
  try {
    yield call(LeadApi.updateLeadSegment, action.payload);
    yield put(actions.updateLeadSegmentSuccess());
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

function* updateLeadSagas(
  action: PayloadAction<PayloadUpdateLead, string, (error?: any) => void>,
) {
  try {
    yield call(LeadApi.updateLeads, action.payload);
    yield put(actions.updateLeadSuccess());
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

function* updateLeadAllotment(
  action: PayloadAction<PayloadLeadAllotment, string, (error?: any) => void>,
) {
  try {
    yield call(LeadApi.updateLeadAllotment, action.payload);
    yield put(actions.updateLeadAllotmentSuccess());
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


function* createSegmentSagas(
  action: PayloadAction<{type: string}, string, (error?: any) => void>,
) {
  try {
    yield call(LeadApi.createSegment, action.payload);
    yield put(actions.createSegmentSuccess());
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

function* updateStatus(
  action: PayloadAction<
    any,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(LeadApi.updateStatus, action.payload);
    yield put(actions.updateStatusSuccess());
    action.meta({ success: true });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

export function* leadSaga() {
  yield takeLatest(actions.fetchListLead.type, fetchListLeadSaga);
  yield takeLatest(actions.fetchListLeadAllotment.type, fetchListLeadAllotmentSaga);
  yield takeLatest(actions.fetchListLeadAlloted.type, fetchListLeadAllotedSaga);
  yield takeLatest(actions.getSegment.type, getSegmentSaga);
  yield takeLatest(actions.getFileImport.type, getFileImportSaga);
  yield takeLatest(actions.updateLeadSegment.type, updateLeadSegment);
  yield takeLatest(actions.updateLeadAllotment.type, updateLeadAllotment);
  yield takeLatest(actions.updateLead.type, updateLeadSagas);
  yield takeLatest(actions.createSegment.type, createSegmentSagas);
  yield takeLatest(actions.fetchListLeadTakeCare.type, fetchListLeadTakeCareSaga);
  yield takeLatest(actions.updateStatus.type, updateStatus);

}
