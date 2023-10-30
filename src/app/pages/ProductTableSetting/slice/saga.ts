import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { FileWithPath } from 'react-dropzone';

import ProductTable from 'services/api/productTable';

import {
  ApartmentList,
  PayloadCheckFileUpload,
  PayloadDeleteProductIsCreated,
  PayloadGetProductOfProject,
  PayloadGetProductTable,
  PayloadProductTable,
  PayloadUploadProductTable,
  ProductOfProject,
  TableProductItem,
} from './types';

import { productTableActions as actions } from '.';

function* createProductTable(
  action: PayloadAction<PayloadProductTable, string, (error?: any) => void>,
) {
  try {
    yield call(ProductTable.createProductTable, action.payload);
    // yield put(actions.createTicketReservationSuccess());
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

function* checkUploadedFile(
  action: PayloadAction<PayloadCheckFileUpload, string, (error?: any) => void>,
) {
  try {
    const { id, formData } = action.payload;

    const result: ApartmentList = yield call(
      ProductTable.checkFileUpload,
      formData,
    );

    yield put(actions.checkFileUploadSuccess({ result, id }));
    action.meta({
      success: true,
      response: result,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      action.meta({
        success: false,
        code: error.code,
        response: error.response,
      });
    }
  }
}

// function* updateProductTable(
//   action: PayloadAction<PayloadProductTable, string, (error?: any) => void>,
// ) {
//   try {
//     yield call(ProductTable.updateProductTable, action.payload);
//     // yield put(actions.createTicketReservationSuccess());
//     action.meta({
//       success: true,
//     });
//   } catch (error: any) {
//     action.meta({
//       success: false,
//       response: error.response,
//     });
//   }
// }

function* getProductTable(
  action: PayloadAction<PayloadGetProductTable, string, (error?: any) => void>,
) {
  try {
    const result: TableProductItem[] = yield call(
      ProductTable.getProjectProductTable,
      action.payload,
    );

    yield put(actions.getProductTableSuccess(result));
    action.meta &&
      action?.meta({
        success: true,
      });
  } catch (error: any) {
    action.meta &&
      action?.meta({
        success: false,
        response: error.response,
      });
  }
}

function* deleteProductIsCreated(
  action: PayloadAction<
    PayloadDeleteProductIsCreated,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(ProductTable.deleteProductIsCreated, action.payload);
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      code: error?.code,
      success: false,
      response: error.response,
    });
  }
}

function* getProductOfProject(
  action: PayloadAction<PayloadGetProductOfProject>,
) {
  try {
    const result: ProductOfProject = yield call(
      ProductTable.getProductOfProject,
      action.payload,
    );
    yield put(actions.getProductOfProjectSuccess(result));
  } catch (error) {
    console.log(error);
  }
}

export function* productTableSaga() {
  yield takeLatest(actions.createProductTable.type, createProductTable);
  yield takeLatest(actions.getProductTable.type, getProductTable);
  yield takeLatest(actions.checkFileUpload.type, checkUploadedFile);
  yield takeLatest(actions.deleteProductIsCreated.type, deleteProductIsCreated); //delete product
  yield takeLatest(actions.getProductOfProject.type, getProductOfProject);
}
