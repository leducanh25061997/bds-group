import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import project from 'services/api/project';
import { Pageable } from 'types';
import { WorkFlowTypeEnum } from 'types/Enum';
import { PayloadGetWorkFlowTree } from 'app/pages/Projects/slice/types';
import { ProcessType } from 'types/Process';

import {
  CreateInformationProjectFormData,
  InformationProjectResponse,
} from './types';

import { managementInformationActions as actions } from '.';

function* createInformationProject(
  action: PayloadAction<
    CreateInformationProjectFormData,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.createProjectSettings, action.payload);
    yield put(actions.createInformationProjectFormDataSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
    yield put(actions.createInformationProjectFormDataError());
  }
}

function* fetchListWorkFlow() {
  try {
    const [
      reservations,
      deposits,
      canceledTiskets,
      contracts,
    ]: Pageable<any>[] = yield all([
      call(project.fetchWorkFlow, {
        page: 1,
        limit: 100,
        workflowType: WorkFlowTypeEnum.RESERVATION,
      }),
      call(project.fetchWorkFlow, {
        page: 1,
        limit: 100,
        workflowType: WorkFlowTypeEnum.DEPOSIT,
      }),
      call(project.fetchWorkFlow, {
        page: 1,
        limit: 100,
        workflowType: WorkFlowTypeEnum.CANCELED_TICKET,
      }),
      call(project.fetchWorkFlow, {
        page: 1,
        limit: 100,
        workflowType: WorkFlowTypeEnum.CONTRACT,
      }),
    ]);

    // const reservations: Pageable<any> = yield call(project.fetchWorkFlow, {
    //   page: 1,
    //   limit: 100,
    //   workflowType: WorkFlowTypeEnum.RESERVATION,
    // });
    // const deposits: Pageable<any> = yield call(project.fetchWorkFlow, {
    //   page: 1,
    //   limit: 100,
    //   workflowType: WorkFlowTypeEnum.DEPOSIT,
    // });
    // const canceledTiskets: Pageable<any> = yield call(project.fetchWorkFlow, {
    //   page: 1,
    //   limit: 100,
    //   workflowType: WorkFlowTypeEnum.CANCELED_TICKET,
    // });
    // const contracts: Pageable<any> = yield call(project.fetchWorkFlow, {
    //   page: 1,
    //   limit: 100,
    //   workflowType: WorkFlowTypeEnum.CONTRACT,
    // });
    yield put(
      actions.fetchListWorkFlowSuccess({
        reservation: reservations.data,
        deposit: deposits.data,
        canceledTicket: canceledTiskets.data,
        contract: contracts.data,
      }),
    );
  } catch (error) {
    console.log(error, 'error');
  }
}

function* fetchInformationProject(action: PayloadAction<string>) {
  try {
    const result: InformationProjectResponse = yield call(
      project.fetchInformationProject,
      action.payload,
    );
    yield put(actions.fetchInformationProjectSuccess(result));
  } catch (error) {
    yield put(actions.fetchInformationProjectFaild());
    console.log(error, 'error');
  }
}

function* fetchWorkFlowTree(action: PayloadAction<PayloadGetWorkFlowTree>) {
  try {
    const result: ProcessType = yield call(
      project.fetchWorkFlowTree,
      action.payload,
    );
    yield put(actions.fetchWorkFlowTreeSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

export function* managementInformationSaga() {
  yield takeLatest(
    actions.createInformationProjectFormData.type,
    createInformationProject,
  );
  yield takeLatest(actions.fetchListWorkFlow.type, fetchListWorkFlow);
  yield takeLatest(
    actions.fetchInformationProject.type,
    fetchInformationProject,
  );
  yield takeLatest(actions.fetchWorkFlowTree.type, fetchWorkFlowTree);
}
