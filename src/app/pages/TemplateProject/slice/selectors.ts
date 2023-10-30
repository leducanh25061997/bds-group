import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types/RootState';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.managementTemplateProjectSlice || initialState;

export const selectManagementTemplate = createSelector(
  [selectSlice],
  state => state,
);
