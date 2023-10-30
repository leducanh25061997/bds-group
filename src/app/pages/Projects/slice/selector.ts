import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.ProjectSlice || initialState;

export const selectProject = createSelector([selectSlice], state => state);
