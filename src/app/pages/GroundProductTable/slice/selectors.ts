import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.groundProductTable || initialState;

export const selectGroundProductTable = createSelector(
  [selectSlice],
  state => state,
);
