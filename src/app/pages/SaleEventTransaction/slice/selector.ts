import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.saleEventTransaction || initialState;

export const selectSaleEventTransaction = createSelector(
  [selectSlice],
  state => state,
);
