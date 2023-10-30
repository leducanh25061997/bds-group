import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { SalesProgramSaga } from './saga';
import {
  PayloadGetDetailSalesProgram,
  PayloadSalesProgram,
  PayloadUpdateSalesProgram,
  PayloadUpdateStatusSalesProgram,
  ProductItem,
  SalesProgramItem,
  SalesProgramState,
  PayloadActionPriceSalesProgram
} from './types';

export const initialState: SalesProgramState = {};

const slice = createSlice({
  name: 'SalesProgramSlice',
  initialState,
  reducers: {
    fetchListSalesProgram(state, action) {
      state.isLoading = true;
    },
    fetchListSalesProgramSuccess: (
      state,
      action: PayloadAction<Pageable<SalesProgramItem>>,
    ) => {
      state.salesProgramManagement = action.payload;
      state.isLoading = false;
    },
    fetchListSalesProgramPrioritySuccess: (
      state,
      action: PayloadAction<Pageable<SalesProgramItem>>,
    ) => {
      state.salesProgramPriorityManagement = action.payload;
      state.isLoading = false;
    },
    createSalesProgram: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadSalesProgram, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createSalesProgramSuccess: () => {},
    updateStatusSalesProgram: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadUpdateStatusSalesProgram,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateStatusSalesProgramSuccess: () => {},
    getDetailSalesProgram(state, action) {
      state.isLoading = true;
    },
    getDetailSalesProgramSuccess: (state, action) => {
      state.isLoading = false;
      state.detailSalesProgram = action.payload;
    },
    clearDataSalesProgram(state) {
      state.salesProgramManagement = null;
    },
    clearDataProduct(state) {
      state.productManagement = null;
    },
    fetchListProduct(state, action) {
      state.isLoading = true;
    },
    fetchListProductSuccess: (state, action: PayloadAction<ProductItem[]>) => {
      state.productManagement = action.payload;
      state.isLoading = false;
    },
    updateDataSalesProgram: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateSalesProgram, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateSalesProgramSuccess: () => {},
    deleteSalesProgram: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadGetDetailSalesProgram,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    deleteSalesProgramSuccess: () => {},

    actionPriceSalesProgram: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadActionPriceSalesProgram,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    actionPriceSalesProgramSuccess: () => {},
  },
});

export const useSalesProgramSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: SalesProgramSaga });
  return { actions: slice.actions };
};

export const { actions: salesProgramActions } = slice;
