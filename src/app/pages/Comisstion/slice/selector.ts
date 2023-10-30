import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.ComisstionSlice || initialState;

export const selectComisstion = createSelector([selectSlice], state => state);
