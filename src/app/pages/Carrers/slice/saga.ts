import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import realEstate from 'services/api/realEstate';
import { FilterParams, Pageable } from 'types';
import { RealEstateItem } from 'types/RealEstate';

import { PropertyType } from 'types/Property';

import {
  PayloadCreateRealEstate,
  PayloadGetDetailRealEstate,
  PayloadUpdateStatusRealEstate,
  PayloadUpdateRealEstate,
} from './types';

import { realEstateActions as actions } from '.';

function* fetchListRealEstateSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<RealEstateItem> = yield call(
      realEstate.fetchListRealEstates,
      action.payload,
    );
    yield put(actions.fetchListRealEstatesSuccess(result));
  } catch (errors) {}
}

function* fetchListViewsType() {
  try {
    const result: PropertyType[] = yield call(realEstate.fetchListViewsType);
    yield put(actions.fetchListViewsTypeSuccess(result));
  } catch (errors) {}
}

function* fetchListFactorsType() {
  try {
    const result: PropertyType[] = yield call(realEstate.fetchListFactorsType);
    yield put(actions.fetchListFactorsTypeSuccess(result));
  } catch (errors) {}
}

function* fetchListRealEstateProject() {
  try {
    const result: PropertyType[] = yield call(
      realEstate.fetchListRealEstateProject,
    );
    yield put(actions.fetchListRealEstateProjectSuccess(result));
  } catch (errors) {}
}

function* fetchListRealEstateFrontageAdvantage() {
  try {
    const result: PropertyType[] = yield call(
      realEstate.fetchListRealEstateFrontageAdvantage,
    );
    yield put(actions.fetchListRealEstateFrontageAdvantageSuccess(result));
  } catch (errors) {}
}

function* createRealEstate(
  action: PayloadAction<PayloadCreateRealEstate, string, (error?: any) => void>,
) {
  try {
    yield call(realEstate.createRealEstate, action.payload);
    yield put(actions.createRealEstateSuccess());
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

function* getDetailRealEstate(
  action: PayloadAction<PayloadGetDetailRealEstate>,
) {
  try {
    const result: RealEstateItem = yield call(
      realEstate.getDetailRealEstate,
      action.payload,
    );
    yield put(actions.getDetailRealEstateSuccess(result));
  } catch (errors) {}
}

function* updateStatusRealEstate(
  action: PayloadAction<
    PayloadUpdateStatusRealEstate,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(realEstate.updateStatusRealEstate, action.payload);
    yield put(actions.updateStatusRealEstateSuccess());
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

function* updateDataRealEstate(
  action: PayloadAction<PayloadUpdateRealEstate, string, (error?: any) => void>,
) {
  try {
    yield call(realEstate.updateRealEstate, action.payload);
    yield put(actions.updateDataRealEstateSuccess());
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

export function* realEstateSaga() {
  yield takeLatest(actions.fetchListRealEstates.type, fetchListRealEstateSaga);
  yield takeLatest(actions.createRealEstate.type, createRealEstate);
  yield takeLatest(actions.fetchListViewsType.type, fetchListViewsType);
  yield takeLatest(actions.fetchListFactorsType.type, fetchListFactorsType);
  yield takeLatest(
    actions.fetchListRealEstateProject.type,
    fetchListRealEstateProject,
  );
  yield takeLatest(
    actions.fetchListRealEstateFrontageAdvantage.type,
    fetchListRealEstateFrontageAdvantage,
  );
  yield takeLatest(actions.getDetailRealEstate.type, getDetailRealEstate);
  yield takeLatest(actions.updateStatusRealEstate.type, updateStatusRealEstate);
  yield takeLatest(actions.updateDataRealEstate.type, updateDataRealEstate);
}
