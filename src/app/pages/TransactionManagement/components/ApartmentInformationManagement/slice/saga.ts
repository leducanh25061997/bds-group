/* eslint-disable no-console */
import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import productTable from 'services/api/productTable';
import project from 'services/api/project';

import Orgchart from 'services/api/orgchart';

import { OrgchartItem } from 'types/Orgchart';

import { Pageable } from 'types';

import {
  ApartmentInformation,
  ApartmentInformationSParams,
  ChangeOrgChartProductRequest,
  MoveProductToSaleProgramParams,
  OpenPriorityAdditionalRequest,
  ProductsCanOrderFilter,
  SettingTableProduct,
  TableProductInformation,
  UpdateNoteParams,
  UpdateStatusTableProductParams,
  UpdateStatusProductCustomerParams,
} from './types';

import { apartmentInformationActions as actions } from '.';

const reduceFetchData = {
  isPriority: {} as any,
  isFree: {} as any,
};
function* fetchDatatable(action: PayloadAction<ApartmentInformationSParams>) {
  const payload = action.payload.isPriority
    ? reduceFetchData.isPriority
    : reduceFetchData.isFree;

  payload.lastTime = Date.now();
  const cacheTime = payload.lastTime;
  yield delay(500);
  // reject old request if have new request (between 500ms)
  if (payload.lastTime !== cacheTime) {
    return;
  }
  yield fetchDatatableBySchedule(action);
  if (action.payload.isPriority) {
    reduceFetchData.isPriority = {
      ...action.payload,
      lastTime: Date.now(),
    };
  } else {
    reduceFetchData.isFree = {
      ...action.payload,
      lastTime: Date.now(),
    };
  }
}
function* fetchDatatableBySchedule(
  action: PayloadAction<ApartmentInformationSParams>,
) {
  try {
    const result: ApartmentInformation = yield call(
      project.fetchDatatable,
      action.payload,
    );
    yield put(actions.fetchDatatableSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* fetchSettingTableProduct(
  action: PayloadAction<ApartmentInformationSParams>,
) {
  try {
    const result: SettingTableProduct[] = yield call(
      project.fetchSettingTableProduct,
      action.payload,
    );
    yield put(actions.fetchSettingTableProductSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* fetchTableProductInformation(action: PayloadAction<string>) {
  try {
    const result: TableProductInformation = yield call(
      project.fetchTableProductInformation,
      action.payload,
    );
    yield put(actions.fetchTableProductInformationSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* updateStatusTableProduct(
  action: PayloadAction<
    UpdateStatusTableProductParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.updateStatusTableProduct, action.payload);
    yield put(actions.updateStatusTableProductSuccess());
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

function* lockTableProduct(
  action: PayloadAction<
    UpdateStatusTableProductParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.lockTableRroduct, action.payload);
    yield put(actions.lockTableProductSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* unlockTableProduct(
  action: PayloadAction<
    UpdateStatusTableProductParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.unLockTableRroduct, action.payload);
    yield put(actions.unlockTableProductSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* changeOrgChartProduct(
  action: PayloadAction<
    ChangeOrgChartProductRequest,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.changeOrgChartProduct, action.payload);
    yield put(actions.changeOrgChartProductSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* updateNoteTableProduct(
  action: PayloadAction<UpdateNoteParams, string, (error?: any) => void>,
) {
  try {
    yield call(project.updateNote, action.payload);
    yield put(actions.updateNoteTableProductSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* fetchProductInformation(action: PayloadAction<string>) {
  try {
    yield call(productTable.fetchProductInformation, action.payload);
    // const result: TableProductInformation = yield call(
    //   productTable.fetchProductInformation,
    //   action.payload,
    // );
    // yield put(actions.fetchProductInformationSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* fetchProductCanOrder(action: PayloadAction<ProductsCanOrderFilter>) {
  try {
    const result: TableProductInformation[] = yield call(
      productTable.productCanOrder,
      action.payload,
    );
    yield put(actions.fetchProductCanOrderSuccess(result));
  } catch (error) {
    console.log(error, 'error');
  }
}

function* createPostOpenPriorityAdditional(
  action: PayloadAction<
    OpenPriorityAdditionalRequest,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(productTable.postOpenPriorityAdditional, action.payload);
    yield put(actions.createPostOpenPriorityAdditionalSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
    console.log(error, 'error');
  }
}

function* fetchListOrgchart(action: PayloadAction<string>) {
  try {
    const result: Pageable<OrgchartItem> = yield call(
      Orgchart.fetchListOrgchartProduct,
      action.payload,
    );
    yield put(actions.fetchListOrgchartSuccess(result));
  } catch (errors) {}
}

function* moveProductToSaleProgram(
  action: PayloadAction<
    MoveProductToSaleProgramParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.moveProductToSaleProgram, action.payload);
    yield put(actions.moveProductToSaleProgramSuccess());
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

function* updateStatusProductCustomer(
  action: PayloadAction<
    UpdateStatusProductCustomerParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.updateStatusProductCustomer, action.payload);
    yield put(actions.updateStatusTableProductSuccess());
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

function* removeProductToSaleProgram(
  action: PayloadAction<
    MoveProductToSaleProgramParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(project.removeProductToSaleProgram, action.payload);
    action.meta({
      success: true,
    });
  } catch (error) {
    action.meta({
      success: false,
    });
  }
}

export function* managementInformationSaga() {
  yield takeLatest(
    actions.fetchProductInformation.type,
    fetchProductInformation,
  );
  yield takeLatest(actions.fetchDatatable.type, fetchDatatable);
  yield takeLatest(
    actions.updateStatusTableProduct.type,
    updateStatusTableProduct,
  );
  yield takeLatest(actions.lockTableProduct.type, lockTableProduct);
  yield takeLatest(actions.unlockTableProduct.type, unlockTableProduct);
  yield takeLatest(actions.changeOrgChartProduct.type, changeOrgChartProduct);
  yield takeLatest(
    actions.fetchSettingTableProduct.type,
    fetchSettingTableProduct,
  );
  yield takeLatest(
    actions.fetchTableProductInformation.type,
    fetchTableProductInformation,
  );
  yield takeLatest(actions.fetchProductCanOrder.type, fetchProductCanOrder);
  yield takeLatest(
    actions.createPostOpenPriorityAdditional.type,
    createPostOpenPriorityAdditional,
  );
  yield takeLatest(actions.fetchListOrgchart.type, fetchListOrgchart);
  yield takeLatest(actions.updateNoteTableProduct.type, updateNoteTableProduct);
  yield takeLatest(
    actions.moveProductToSaleProgram.type,
    moveProductToSaleProgram,
  );
  yield takeLatest(
    actions.updateStatusProductCustomer.type,
    updateStatusProductCustomer,
  );
  yield takeLatest(
    actions.removeProductToSaleProgram.type,
    removeProductToSaleProgram,
  );
}
