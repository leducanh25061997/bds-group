import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.logImportCustomerSlice || initialState;

export const selectCustomerLogImport = createSelector([selectSlice], state => state);
