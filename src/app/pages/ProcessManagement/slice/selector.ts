import { RootState } from 'types/RootState';
import { createSelector } from '@reduxjs/toolkit';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.processManagementSlice || initialState;

export const selectProcessManagement = createSelector(
  [selectSlice],
  state => state,
);
