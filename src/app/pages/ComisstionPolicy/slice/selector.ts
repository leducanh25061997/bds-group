import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.ComisstionPolicySlice || initialState;

export const selectComisstion = createSelector([selectSlice], state => state);
