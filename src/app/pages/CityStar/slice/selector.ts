import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.CityStarSlice || initialState;

export const selectCityStar = createSelector([selectSlice], state => state);
