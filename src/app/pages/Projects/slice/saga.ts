import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import Project from 'services/api/project';
import Staff from 'services/api/staff';
import { FilterParams, Pageable } from 'types';
import { ProjectItem } from 'types/Project';
import { PayloadGetListStaffInProject } from 'app/pages/Staff/slice/types';

import {
  PayloadCreateProject,
  PayloadGetDetailProject,
  PayloadUpdateProject,
} from './types';

import { StaffItem } from './../../ProcessManagement/slice/type';

import { customerActions as actions } from '.';

function* fetchListProject(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ProjectItem> = yield call(
      Project.fetchListProject,
      action.payload,
    );
    yield put(actions.fetchListProjectSuccess(result));
  } catch (errors) {}
}

function* createProject(
  action: PayloadAction<PayloadCreateProject, string, (error?: any) => void>,
) {
  try {
    yield call(Project.createProject, action.payload);
    yield put(actions.createProjectSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      code: error.code,
      response: error?.response?.data?.message || error?.message,
    });
  }
}

function* getDetailProject(action: PayloadAction<PayloadGetDetailProject>) {
  try {
    const result: ProjectItem = yield call(
      Project.getDetailProject,
      action.payload,
    );
    yield put(actions.getDetailProjectSuccess(result));
  } catch (errors) {}
}

function* updateDataProject(
  action: PayloadAction<PayloadUpdateProject, string, (error?: any) => void>,
) {
  try {
    yield call(Project.updateProject, action.payload);
    yield put(actions.updateDataProjectSuccess());
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

function* getListStaffInProject(
  action: PayloadAction<PayloadGetListStaffInProject>,
) {
  try {
    const result: StaffItem[] = yield call(
      Staff.getListStaffInProject,
      action.payload,
    );
    yield put(actions.getListStaffInProjectSuccess(result));
  } catch (errors) {}
}

export function* ProjectSaga() {
  yield takeLatest(actions.fetchListProject.type, fetchListProject);
  yield takeLatest(actions.createProject.type, createProject);
  yield takeLatest(actions.getDetailProject.type, getDetailProject);
  yield takeLatest(actions.updateDataProject.type, updateDataProject);
  yield takeLatest(actions.getListStaffInProject.type, getListStaffInProject);
}
