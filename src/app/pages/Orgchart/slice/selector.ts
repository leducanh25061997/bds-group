import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.OrgchartSlice || initialState;

export const selectOrgchart = createSelector([selectSlice], state => state);
