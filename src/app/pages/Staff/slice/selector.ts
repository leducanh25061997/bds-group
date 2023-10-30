import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.staffSlice || initialState;

export const selectStaff = createSelector([selectSlice], state => state);
