import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

export const selectPermission = (state: RootState) =>
  state.saleEventControl?.permission || initialState.permission;
export const selectEventSale = (state: RootState) =>
  state.saleEventControl?.eventSale || initialState.eventSale;
export const selectCurrentOrgChart = (state: RootState) =>
  state.saleEventControl?.currentOrgChart || initialState.currentOrgChart;
export const selectReport = (state: RootState) =>
  state.saleEventControl?.report || initialState.report;
export const selectNotifications = (state: RootState) =>
  state.saleEventControl?.notifications || initialState.notifications;

// const selectSlice = (state: RootState) =>
//   state.saleEventControl || initialState;

export const selectSaleEventControl = createSelector(
  [
    selectPermission,
    selectEventSale,
    selectCurrentOrgChart,
    selectReport,
    selectNotifications,
  ],
  (permission, eventSale, currentOrgChart, report, notifications) => {
    return {
      permission,
      eventSale,
      currentOrgChart,
      report,
      notifications,
    };
  },
);
