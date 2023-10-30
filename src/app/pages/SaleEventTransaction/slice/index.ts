import { PayloadAction } from '@reduxjs/toolkit';
import { SignProductParams } from 'types/Project';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { SaleEventTransactionSaga } from './saga';

import {
  SaleEventTransactionProtype,
  SaleEventTransactionState,
  TransactionParams,
  CompleteProfileForm,
  CheckPermissionEventSaleParams,
  PermissionEventSaleProtype,
} from './types';

export const initialState: SaleEventTransactionState = {
  isLoadingFree: false,
  loadingHeader: '',
  isLoadingPriority: false,
};

const slice = createSlice({
  name: 'saleEventTransaction',
  initialState,
  reducers: {
    setSearchKey(state, action: PayloadAction<TransactionParams>) {
      state.searchKey = action.payload.search;
    },
    fetchSaleEventTransaction(state, action: PayloadAction<TransactionParams>) {
      state.saleEventTransaction = null;
      if (!action.payload.refreshPharse) {
        state.loadingHeader = 'PHARSE_ALL';
      } else {
        state.loadingHeader = action.payload.refreshPharse || '';
        if (action.payload.refreshPharse === 'PHARSE_1') {
          state.isLoadingPriority = true;
        } else {
          state.isLoadingFree = true;
        }
      }
    },

    fetchSaleEventTransactionSuccess: (
      state,
      action: PayloadAction<SaleEventTransactionProtype>,
    ) => {
      state.saleEventTransaction = action.payload;
      state.loadingHeader = '';
    },

    fetchSaleEventTransactionFaild: state => {
      state.saleEventTransaction = null;
      state.loadingHeader = '';
    },
    completeProfile: {
      reducer(state) {
        return state;
      },
      prepare(params: CompleteProfileForm, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    addProfile: {
      reducer(state) {
        return state;
      },
      prepare(params: CompleteProfileForm, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    fetchSaleEventTransactionPrioritySuccess: (
      state,
      action: PayloadAction<SaleEventTransactionProtype>,
    ) => {
      state.saleEventTransactionPriority = action.payload;
      state.isLoadingPriority = false;
      state.loadingHeader = '';
    },

    fetchSaleEventTransactionFreeSuccess: (
      state,
      action: PayloadAction<SaleEventTransactionProtype>,
    ) => {
      state.saleEventTransactionFree = action.payload;
      state.isLoadingFree = false;
      state.loadingHeader = '';
    },

    fetchSaleEventTransactionPriorityFaild: state => {
      state.saleEventTransactionPriority = null;
      state.isLoadingPriority = false;
      state.loadingHeader = '';
    },
    fetchSaleEventTransactionFreeFaild: state => {
      state.saleEventTransactionFree = null;
      state.isLoadingFree = false;
      state.loadingHeader = '';
    },

    creteProductCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: any, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    signProduct: {
      reducer(state) {
        return state;
      },
      prepare(params: SignProductParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    returnProduct: {
      reducer(state) {
        return state;
      },
      prepare(params: SignProductParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    fetchPermissionEventSale(
      state,
      action: PayloadAction<CheckPermissionEventSaleParams>,
    ) {},

    fetchPermissionEventSaleSuccess: (
      state,
      action: PayloadAction<PermissionEventSaleProtype>,
    ) => {
      state.permissionEventSale = action.payload;
    },

    fetchPermissionEventSaleFaild: state => {},
  },
});

export const useSaleEventTransactionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: SaleEventTransactionSaga });
  return { actions: slice.actions };
};

export const { actions: saleEventTransactionActions } = slice;
