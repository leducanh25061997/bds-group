import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import contract from 'services/api/contract';
import { FilterParams, Pageable } from 'types';

import { PayloadCommentContract } from './types';

import { contractActions as actions } from '.';

function* approveContractCustomer(
  action: PayloadAction<string, string, (error?: any) => void>,
) {
  try {
    yield call(contract.approveContractCustomer, action.payload);
    yield put(actions.approveContractCustomerSuccess());
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

function* refuseContractCustomer(
  action: PayloadAction<string, string, (error?: any) => void>,
) {
  try {
    yield call(contract.refuseContractCustomer, action.payload);
    yield put(actions.refuseContractCustomerSuccess());
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

function* commentContract(
  action: PayloadAction<PayloadCommentContract, string, (error?: any) => void>,
) {
  try {
    yield call(contract.commentContract, action.payload);
    yield put(actions.commentContractSuccess());
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

function* approveLiquidateContract(
  action: PayloadAction<string, string, (error?: any) => void>,
) {
  try {
    yield call(contract.approveLiquidateContract, action.payload);
    yield put(actions.approveContractCustomerSuccess());
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

function* refuseLiquidateContract(
  action: PayloadAction<string, string, (error?: any) => void>,
) {
  try {
    yield call(contract.refuseLiquidateContract, action.payload);
    yield put(actions.refuseContractCustomerSuccess());
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

export function* contractCustomerSaga() {
  yield takeLatest(
    actions.approveContractCustomer.type,
    approveContractCustomer,
  );
  yield takeLatest(actions.refuseContractCustomer.type, refuseContractCustomer);
  yield takeLatest(actions.commentContract.type, commentContract);
  yield takeLatest(
    actions.approveLiquidateContract.type,
    approveLiquidateContract,
  );
  yield takeLatest(
    actions.refuseLiquidateContract.type,
    refuseLiquidateContract,
  );
}
