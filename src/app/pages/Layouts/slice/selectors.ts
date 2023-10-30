import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.layouts || initialState;

export const layoutsSelector = createSelector([selectSlice], state => state);
