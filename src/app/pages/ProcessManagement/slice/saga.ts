import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import Process from 'services/api/process';
import { FilterParams, Pageable } from 'types';
import {
  PayloadCreateWorkFlow,
  PayloadGetDetailWorkFlow,
  PayloadUpdateWorkFlow,
  ProcessItem,
  WorkFlowItem,
} from './type';

import { processManagementActions as actions } from '.';

function* fetchListProcess(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ProcessItem> = yield call(
      Process.fetchListProcess,
      action.payload,
    );
    yield put(actions.fetchListProcessSuccess(result));
  } catch (errors) {}
}

function* createWorkFlow(
  action: PayloadAction<PayloadCreateWorkFlow, string, (error?: any) => void>,
) {
  try {
    yield call(Process.createWorkFlow, action.payload);
    yield put(actions.createWorkFlowSuccess());
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

function* getDetailWorkFlow(action: PayloadAction<PayloadGetDetailWorkFlow>) {
  try {
    const result: WorkFlowItem = yield call(
      Process.getDetailWorkFlow,
      action.payload,
    );
    yield put(actions.getDetailWorkFlowSuccess(result));
  } catch (errors) {}
}

function* deleteWorkFlow(
  action: PayloadAction<
    PayloadGetDetailWorkFlow,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Process.deleteWorkFlow, action.payload);
    yield put(actions.deleteWorkFlowSuccess());
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

function* updateWorkFlowTree(
  action: PayloadAction<PayloadUpdateWorkFlow, string, (error?: any) => void>,
) {
  try {
    yield call(Process.updateWorkFlowTree, action.payload);
    yield put(actions.updateWorkFlowTreeSuccess());
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

export function* ProcessManagementSaga() {
  yield takeLatest(actions.fetchListProcess.type, fetchListProcess);
  yield takeLatest(actions.createWorkFlow.type, createWorkFlow);
  yield takeLatest(actions.getDetailWorkFlow.type, getDetailWorkFlow);
  yield takeLatest(actions.deleteWorkFlow.type, deleteWorkFlow);
  yield takeLatest(actions.updateWorkFlowTree.type, updateWorkFlowTree);
}
