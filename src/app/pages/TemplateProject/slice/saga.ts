import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import TemplateProject from 'services/api/templateProject';

import {
  PayloadCreateFileDocument,
  PayloadDeleteTemplateDocumentPrint,
  PayloadGetDocumentPrintDetail,
  PayloadUpdateFileDocument,
  fileDocumentitem,
  PayloadCreateTemplateEmailAndSms,
  TemplateTypeEnum,
  ProviderSMS,
} from './types';

import { managementTemplateActions as actions } from '.';

function* fetchListTemplateDocument(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<fileDocumentitem> = yield call(
      TemplateProject.fetchListTemplateDocument,
      action.payload,
    );
    yield put(actions.fetchListTemplateDocumentSuccess(result));
  } catch (errors) {}
}

function* createTemplateDocument(
  action: PayloadAction<
    PayloadCreateFileDocument,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(TemplateProject.createTemplateDocument, action.payload);
    yield put(actions.createTemplateDocumentSuccess());
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
function* getDetailDocumentPrint(
  action: PayloadAction<PayloadGetDocumentPrintDetail>,
) {
  try {
    const result: fileDocumentitem = yield call(
      TemplateProject.getDetailDocumentPrint,
      action.payload,
    );
    yield put(actions.getDetailDocumentPrintSuccess(result));
  } catch (errors) {}
}
function* updateTemplateDocumentPrint(
  action: PayloadAction<
    PayloadUpdateFileDocument,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(TemplateProject.updateTemplateDocumentPrint, action.payload);
    yield put(actions.updateTemplateDocumentPrintSuccess());
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
function* deleteTemplateDocumentPrint(
  action: PayloadAction<
    PayloadDeleteTemplateDocumentPrint,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(TemplateProject.deleteTemplateDocumentPrint, action.payload);
    yield put(actions.deleteTemplateDocumentPrintSuccess());
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

function* createTemplateEmailAndSMS(
  action: PayloadAction<
    PayloadCreateTemplateEmailAndSms,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(TemplateProject.createTemplateEmailAndSms, action.payload);
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

function* fetchListTemplateEmailAndSms(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<PayloadCreateTemplateEmailAndSms> = yield call(
      TemplateProject.fetchListTemplateEmailAndSms,
      action.payload,
    );
    if (action.payload.type === TemplateTypeEnum.SMS) {
      yield put(actions.fetchListTemplateSMSSuccess(result));
    } else {
      yield put(actions.fetchListTemplateEmailSuccess(result));
    }
  } catch (errors) {}
}

function* deleteTemplateEmailAndSms(
  action: PayloadAction<
    PayloadCreateTemplateEmailAndSms,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(TemplateProject.deleteTemplateEmailAndSms, action.payload);
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

function* updateTemplateEmailAndSms(
  action: PayloadAction<
    PayloadCreateTemplateEmailAndSms,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(TemplateProject.updateTemplateEmailAndSms, action.payload);
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

function* fetchListProviderSMS(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ProviderSMS> = yield call(
      TemplateProject.getListBranchProvider,
      action.payload,
    );
    yield put(actions.fetchListProviderSMSSuccess(result));
  } catch (errors) {}
}

export function* managementTemplateSaga() {
  yield takeLatest(
    actions.fetchListTemplateDocument.type,
    fetchListTemplateDocument,
  );
  yield takeLatest(actions.createTemplateDocument.type, createTemplateDocument);
  yield takeLatest(actions.getDetailDocumentPrint.type, getDetailDocumentPrint);
  yield takeLatest(
    actions.updateTemplateDocumentPrint.type,
    updateTemplateDocumentPrint,
  );
  yield takeLatest(
    actions.deleteTemplateDocumentPrint.type,
    deleteTemplateDocumentPrint,
  );
  yield takeLatest(
    actions.createTemplateEmailAndSMS.type,
    createTemplateEmailAndSMS,
  );
  yield takeEvery(
    actions.fetchListTemplateEmailAndSms.type,
    fetchListTemplateEmailAndSms,
  );
  yield takeLatest(
    actions.deleteTemplateEmailAndSms.type,
    deleteTemplateEmailAndSms,
  );
  yield takeLatest(
    actions.updateTemplateEmailAndSMS.type,
    updateTemplateEmailAndSms,
  );
  yield takeLatest(actions.fetchListProviderSMS.type, fetchListProviderSMS);
}
