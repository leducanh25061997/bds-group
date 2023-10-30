import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state?.noticationSlice || initialState;

export const selectNotify = createSelector([selectSlice], state => state);
