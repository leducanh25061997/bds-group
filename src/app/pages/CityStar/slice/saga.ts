import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import CityStar from 'services/api/citystar';
import { FilterParams, Pageable } from 'types';

import { CityStarItem, MembershipActive, MembershipItem } from 'types/CityStar';



import { CityStarActions as actions } from '.';
import { PayloadActiveMembership, PayloadCheckExistCode, PayloadGetDetailCityStar, PayloadMembershipSuccess, PayloadPostCodeGenerate } from './types';

function* fetchListCityStarSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<MembershipItem> = yield call(
      CityStar.fetchListCityStar,
      action.payload,
    );
    yield put(actions.fetchListCityStarSuccess(result));
  } catch (errors) {}
}

function* fetchListCustomerCityStarSaga(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<CityStarItem> = yield call(
      CityStar.fetchListCustomerCityStar,
      action.payload,
    );
    yield put(actions.fetchListCustomerCityStarSuccess(result));
  } catch (errors) {}
}

function* checkCustomerExist(
  action: PayloadAction<
    PayloadCheckExistCode,
    string,
    (error?: any) => void
  >,
) {
  try {
    const result: PayloadMembershipSuccess =  yield call(CityStar.checkCustomerExist, action.payload);
    yield put(actions.checkCustomerExistSuccess());
    action.meta({
      success: true,
      data: result?.data
    });
  } catch (error: any) {
      action.meta({
        success: false,
        code: error.code,
        response: error.response,
      });
  }
}

function* activeMembership(
  action: PayloadAction<PayloadActiveMembership, string, (error?: any) => void>,
) {
  try {
    yield call(CityStar.activeMembership, action.payload);
    yield put(actions.activeMembershipSuccess());
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

function* postCodeGenerateSaga(
  action: PayloadAction<PayloadPostCodeGenerate, string, (error?: any) => void>,
) {
  try {
    const result : MembershipItem = yield call(CityStar.postCodeGenerate, action.payload);
    yield put(actions.postCodeGenerateSuccess());
    action.meta({
      success: true,
      response: result,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}

function* getDetailMembershipSaga(action: PayloadAction<PayloadGetDetailCityStar>) {
  try {
    const result: CityStarItem = yield call(CityStar.getDetailMembership, action.payload);
    yield put(actions.getDetailMembershipSuccess(result));
  } catch (errors) {}
}

function* getDetailMembershipActiveSaga(action: PayloadAction<PayloadGetDetailCityStar>) {
  try {
    const result: MembershipActive = yield call(CityStar.getDetailMembershipActive, action.payload);
    yield put(actions.getDetailMembershipActiveSuccess(result));
  } catch (errors) {}
}



export function* CityStarSaga() {
  yield takeLatest(actions.fetchListCityStar.type, fetchListCityStarSaga);
  yield takeLatest(actions.fetchListCustomerCityStar.type, fetchListCustomerCityStarSaga);
  yield takeLatest(actions.checkCustomerExist.type, checkCustomerExist);
  yield takeLatest(actions.activeMembership.type, activeMembership);
  yield takeLatest(actions.postCodeGenerate.type, postCodeGenerateSaga);
  yield takeLatest(actions.getDetailMembership.type, getDetailMembershipSaga);
  yield takeLatest(actions.getDetailMembershipActive.type, getDetailMembershipActiveSaga);
}
