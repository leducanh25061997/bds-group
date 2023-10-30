import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.leadSlice || initialState;

export const selectLeads = createSelector([selectSlice], state => state);
