import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.settingSlice || initialState;

export const selectSettingCustomer = createSelector(
  [selectSlice],
  state => state,
);
