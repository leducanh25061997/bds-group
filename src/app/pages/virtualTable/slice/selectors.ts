import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.virtualTable || initialState;

export const selectVirtualTable = createSelector(
  [selectSlice],
  state => state,
);
