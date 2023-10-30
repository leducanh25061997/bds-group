import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state?.dashboardsSlice || initialState;

export const selectDashBoard = createSelector([selectSlice], state => state);
