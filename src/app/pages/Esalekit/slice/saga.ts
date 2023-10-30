import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { EsalekitItem, GalleryHeaderItem, LefttabItem } from 'types/Esalekit';

import Esalekit from 'services/api/esalekit';

import {
  PayloadCreateConsultation,
  PayloadCreateContent,
  PayloadCreateHeadTab,
  PayloadCreateLeftTab,
  PayloadGetEsalekit,
  PayloadUpdateHeadTab,
  PayloadUpdateLeftTab,
} from './types';

import { EsalekitActions as actions } from '.';

function* createLeftTabEsalekit(
  action: PayloadAction<PayloadCreateLeftTab, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.createLeftTab, action.payload);
    yield put(actions.createLeftTabSuccess());
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

function* createHeadTabEsalekit(
  action: PayloadAction<PayloadCreateHeadTab, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.createHeadTab, action.payload);
    yield put(actions.createHeaderTabSuccess());
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

function* createConsultantSaga(
  action: PayloadAction<PayloadCreateConsultation, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.createConsultant, action.payload);
    yield put(actions.createConsultantSuccess());
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

function* createGallerySagas(
  action: PayloadAction<PayloadCreateHeadTab, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.createGallery, action.payload);
    yield put(actions.createGallerySuccess());
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

function* createContentSagas(
  action: PayloadAction<PayloadCreateContent, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.createContent, action.payload);
    yield put(actions.createContentSuccess());
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

function* createGroundSagas(
  action: PayloadAction<PayloadCreateHeadTab, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.createGround, action.payload);
    yield put(actions.createGroundSuccess());
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

function* getEsalekitSaga(action: PayloadAction<PayloadGetEsalekit>) {
  try {
    const result: EsalekitItem = yield call(
      Esalekit.getEsalekit,
      action.payload,
    );
    yield put(actions.getEsalekitSuccess(result));
  } catch (error: any) {}
}

function* getGalleryHeaderSaga(action: PayloadAction<PayloadGetEsalekit>) {
  try {
    const result: GalleryHeaderItem[] = yield call(
      Esalekit.getGalleryHeader,
      action.payload,
    );
    yield put(actions.getGalleryHeaderSuccess(result));
  } catch (error: any) {}
}

function* getGalleryTypeSaga(action: PayloadAction<PayloadGetEsalekit>) {
  try {
    const result: GalleryHeaderItem[] = yield call(
      Esalekit.getGalleryByType,
      action.payload,
    );
    yield put(actions.getGalleryTypeSuccess(result));
  } catch (error: any) {}
}

function* getAllGallerySaga(action: PayloadAction<PayloadGetEsalekit>) {
  try {
    const result: GalleryHeaderItem[] = yield call(
      Esalekit.getAllGallery,
      action.payload,
    );
    yield put(actions.getAllGallerySuccess(result));
  } catch (error: any) {}
}

function* getHeaderSaga(action: PayloadAction<PayloadGetEsalekit>) {
  try {
    const result: GalleryHeaderItem[] = yield call(
      Esalekit.getHeaderTab,
      action.payload,
    );
    yield put(actions.getHeadertabSuccess(result));
  } catch (error: any) {}
}

function* getLefttabSaga(action: PayloadAction<PayloadGetEsalekit>) {
  try {
    const result: LefttabItem = yield call(
      Esalekit.getEsalekitLefttab,
      action.payload,
    );
    yield put(actions.getLefttabSuccess(result));
  } catch (error: any) {}
}

function* updateLeftTab(
  action: PayloadAction<PayloadUpdateLeftTab, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.updateLeftTab, action.payload);
    yield put(actions.updateLeftTabSuccess());
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

function* changeAvatarGallery(
  action: PayloadAction<string, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.changeAvatarGallery, action.payload);
    yield put(actions.changeAvatarGallerySuccess());
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

function* updateHeadTab(
  action: PayloadAction<PayloadUpdateHeadTab, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.updateHeadTab, action.payload);
    yield put(actions.updateHeadTabSuccess());
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

function* deleteLeftTabSaga(
  action: PayloadAction<PayloadGetEsalekit, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.deleteLeftTab, action.payload);
    yield put(actions.deleteLeftTabSuccess());
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

function* deleteGallerySSaga(
  action: PayloadAction<PayloadGetEsalekit, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.deleteGallery, action.payload);
    yield put(actions.deleteGallerySuccess());
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

function* deleteHeaderTabSaga(
  action: PayloadAction<PayloadGetEsalekit, string, (error?: any) => void>,
) {
  try {
    yield call(Esalekit.deleteHeaderTab, action.payload);
    yield put(actions.deleteHeaderTabSuccess());
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

export function* EsalekitSaga() {
  yield takeLatest(actions.createLeftTab.type, createLeftTabEsalekit);
  yield takeLatest(actions.createHeaderTab.type, createHeadTabEsalekit);
  yield takeLatest(actions.updateHeadTab.type, updateHeadTab);
  yield takeLatest(actions.createContent.type, createContentSagas);
  yield takeLatest(actions.updateLeftTab.type, updateLeftTab);
  yield takeLatest(actions.getEsalekit.type, getEsalekitSaga);
  yield takeLatest(actions.getLefttab.type, getLefttabSaga);
  yield takeLatest(actions.getGalleryHeader.type, getGalleryHeaderSaga);
  yield takeLatest(actions.createConsultant.type, createConsultantSaga);
  yield takeLatest(actions.getAllGallery.type, getAllGallerySaga);
  yield takeLatest(actions.getGalleryType.type, getGalleryTypeSaga);
  yield takeLatest(actions.deleteLeftTab.type, deleteLeftTabSaga);
  yield takeLatest(actions.deleteHeaderTab.type, deleteHeaderTabSaga);
  yield takeLatest(actions.createGallery.type, createGallerySagas);
  yield takeLatest(actions.deleteGallery.type, deleteGallerySSaga);
  yield takeLatest(actions.createGround.type, createGroundSagas);
  yield takeLatest(actions.getHeadertab.type, getHeaderSaga);
  yield takeLatest(actions.changeAvatarGallery.type, changeAvatarGallery);
}
