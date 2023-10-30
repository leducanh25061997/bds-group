import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { CustomerItem } from 'types/User';

import {
  CustomerState,
  PayloadUpdateStatusCustomer,
  PayloadCreateCustomer,
  PayloadUpdateCustomer,
  PayloadCreateActivity,
  PayloadAppraisalCustomer,
  PayloadApproveAction,
  PayloadSendApproveCustomer,
  PayloadSentApprove,
} from './types';

import { customerSaga } from './saga';

export const initialState: CustomerState = {};

const slice = createSlice({
  name: 'customerSlice',
  initialState,
  reducers: {
    fetchListCustomer(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
    fetchListCustomerSuccess: (
      state,
      action: PayloadAction<Pageable<CustomerItem>>,
    ) => {
      state.customerManager = action.payload;
      state.isLoading = false;
    },
    fetchListCustomerInTicket(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
    fetchListCustomerInTicketSuccess: (
      state,
      action: PayloadAction<Pageable<CustomerItem>>,
    ) => {
      state.customerManager = action.payload;
      state.isLoading = false;
    },
    fetchListCustomerTransacion(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
    fetchListCustomerTransacionSuccess: (
      state,
      action: PayloadAction<Pageable<CustomerItem>>,
    ) => {
      state.customerManagerTrans = action.payload;
      state.isLoading = false;
    },
    clearListCustomer(state) {
      state.customerManager = undefined;
    },
    clearListCustomerTrans(state) {
      state.customerManagerTrans = undefined;
    },
    updateStatusCustomer: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadUpdateStatusCustomer,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateStatusCustomerSuccess: () => {},
    getDetailCustomer(state, action) {
      state.isLoading = true;
    },
    getDetailCustomerSuccess: (state, action) => {
      state.isLoading = false;
      state.customerDetail = action.payload;
    },
    createCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateCustomer, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createCustomerSuccess: () => {},
    clearDataCustomer(state) {
      state.customerDetail = null;
    },
    updateDataCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateCustomer, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataCustomerSuccess: () => {},

    sendApproveCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadSentApprove, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    sendApproveCustomerSuccess: () => {},

    updateApproveCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadApproveAction, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateApproveCustomerSuccess: () => {},

    createActivityCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateActivity, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createActivityCustomerSuccess: () => {},

    resetCustomerList(state) {
      state.customerManager = {
        total: 0,
        data: [],
      };
    },
    searchingCustomerList: {
      reducer(state) {
        return state;
      },
      prepare(params: FilterParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    searchingCustomerListSuccess: () => {},
    appraisalCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadAppraisalCustomer, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    appraisalCustomerSuccess: () => {},
  },
});

export const useCustomerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: customerSaga });
  return { actions: slice.actions };
};

export const { actions: customerActions } = slice;
