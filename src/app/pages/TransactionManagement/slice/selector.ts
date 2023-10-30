import { RootState } from 'types/RootState';
import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.transactionManagementSlice || initialState;

export const selectTransactionManagement = createSelector(
  [selectSlice],
  state => state,
);
