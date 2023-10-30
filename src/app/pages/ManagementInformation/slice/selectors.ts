import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.managementInformation || initialState;

export const selectManagementInformation = createSelector(
  [selectSlice],
  state => state,
);
