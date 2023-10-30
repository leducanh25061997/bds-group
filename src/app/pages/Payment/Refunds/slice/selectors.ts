import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.refunds || initialState;

export const selectRefund = createSelector(
  [selectSlice],
  state => state,
);