import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.customerSlice || initialState;

export const selectCustomer = createSelector([selectSlice], state => state);
