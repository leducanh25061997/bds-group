import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PayloadGetOrgtChart } from 'app/pages/SalesProgram/slice/types';

import { SaleEventControlSaga } from './saga';

import {
  EventPermission,
  EventReport,
  PayloadCheckEventPermission,
  PayloadGetNotification,
  PayloadGetReport,
  SaleEventControlState,
} from './types';

export const initialState: SaleEventControlState = {
  report: {
    data: {
      product_not_transaction: 0,
      product_inprogress_transaction: 0,
      phase1_success: 0,
      phase2_success: 0,
      total_product: 0,
      count_unit: 0,
    },
  },
};

const slice = createSlice({
  name: 'saleEventControl',
  initialState,
  reducers: {
    fetchEventSalesInfo(state, action: PayloadAction<{ id: string }>) {},
    fetchEventSalesInfoSuccess(state, action) {
      state.eventSale = action.payload;
    },
    clearEventSalesInfo(state) {
      state.eventSale = null;
    },
    getOrgChart(state, action: PayloadAction<PayloadGetOrgtChart>) {},
    getOrgChartSuccess(state, action) {
      state.currentOrgChart = action.payload;
    },
    clearOrgChart(state) {
      state.currentOrgChart = [];
    },
    getNotification(state, action: PayloadAction<PayloadGetNotification>) {},
    getNotificationSuccess(state, action) {
      state.notifications = action.payload;
    },
    clearNotification(state) {
      state.notifications = {
        data: [],
        total: 0,
      };
    },
    getEventReport(state, action: PayloadAction<PayloadGetReport>) {},
    getEventReportSuccess(state, action: PayloadAction<EventReport>) {
      state.report = action.payload;
    },
    clearEventReport(state) {
      state.report = {
        data: {
          product_not_transaction: 0,
          product_inprogress_transaction: 0,
          phase1_success: 0,
          phase2_success: 0,
          total_product: 0,
          count_unit: 0,
        },
      };
    },
    checkEventSalesPermission(
      state,
      action: PayloadAction<PayloadCheckEventPermission>,
    ) {},
    checkEventSalesPermissionSuccess(
      state,
      action: PayloadAction<EventPermission>,
    ) {
      state.permission = action.payload;
    },
  },
});

export const useSaleEventControlSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: SaleEventControlSaga });
  return { actions: slice.actions };
};

export const { actions: saleEventControlActions } = slice;
