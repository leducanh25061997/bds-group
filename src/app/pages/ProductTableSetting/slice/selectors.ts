import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.productTableSlice || initialState;

export const selectProductTable = createSelector([selectSlice], state => state);
