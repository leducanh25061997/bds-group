import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.SalesProgramSlice || initialState;

export const selectSalesProgram = createSelector([selectSlice], state => state);
