import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.kpiMissionSlice || initialState;

export const selectKpiMissionState = createSelector(
  [selectSlice],
  state => state,
);
