import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { FilterParams, Pageable } from 'types';
import category from 'services/api/category';

import {
  CategoryItem,
  PayloadCreateCategory,
  PayloadGetDetailCategory,
} from './types';

import { categoryActions as actions } from '.';

function* getListCategories(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<CategoryItem> = yield call(
      category.getListCategories,
      action.payload,
    );
    yield put(actions.getListCategoriesSuccess(result));
  } catch (errors) {}
}

function* createCategory(
  action: PayloadAction<PayloadCreateCategory, string, (error?: any) => void>,
) {
  try {
    yield call(category.createCategory, action.payload);
    yield put(actions.createCategorySuccess());
    action.meta({
      success: true,
    });
  } catch (errors: any) {
    action.meta({
      success: false,
      response: errors.response,
    });
  }
}

function* getDetailCategory(action: PayloadAction<PayloadGetDetailCategory>) {
  try {
    const result: CategoryItem = yield call(
      category.getDetailCategory,
      action.payload,
    );
    yield put(actions.getDetailCategorySuccess(result));
  } catch (errors) {}
}

function* editCategory(
  action: PayloadAction<CategoryItem, string, (error?: any) => void>,
) {
  try {
    yield call(category.editCategory, action.payload);
    yield put(actions.createCategorySuccess());
    action.meta({
      success: true,
    });
  } catch (errors: any) {
    action.meta({
      success: false,
      response: errors.response,
    });
  }
}

function* updateStatusCategory(
  action: PayloadAction<
    PayloadGetDetailCategory,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(category.updateStatusCategory, action.payload);
    yield put(actions.updateStatusCategorySuccess());
    action.meta({
      success: true,
    });
  } catch (errors: any) {
    action.meta({
      success: false,
      response: errors.response,
    });
  }
}

export function* categorySaga() {
  yield takeLatest(actions.getListCategories.type, getListCategories);
  yield takeLatest(actions.createCategory.type, createCategory);
  yield takeLatest(actions.getDetailCategory.type, getDetailCategory);
  yield takeLatest(actions.editCategory.type, editCategory);
  yield takeLatest(actions.updateStatusCategory.type, updateStatusCategory);
}
