import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.receipts || initialState;

export const selectReceipt = createSelector(
  [selectSlice],
  state => state,
);