import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { categorySaga } from './saga';

import {
  CategoryItem,
  CategoryState,
  PayloadCreateCategory,
  PayloadGetDetailCategory,
} from './types';

export const initialState: CategoryState = {};

const slice = createSlice({
  name: 'categorySlice',
  initialState,
  reducers: {
    getListCategories(state, action) {
      state.isLoading = true;
    },
    getListCategoriesSuccess: (
      state,
      action: PayloadAction<Pageable<CategoryItem>>,
    ) => {
      state.categoriesList = action.payload;
      state.isLoading = false;
    },
    createCategory: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateCategory, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createCategorySuccess: () => {},
    getDetailCategory(state, action) {
      state.isLoading = true;
    },
    getDetailCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.categoryDetail = action.payload;
    },
    editCategory: {
      reducer(state) {
        return state;
      },
      prepare(params: CategoryItem, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    editCategorySuccess: () => {},
    updateStatusCategory: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadGetDetailCategory, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateStatusCategorySuccess: () => {},
  },
});

export const useCategorySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: categorySaga });
  return { actions: slice.actions };
};

export const { actions: categoryActions } = slice;
