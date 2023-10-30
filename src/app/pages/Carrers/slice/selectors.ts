import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.realEstateSlice || initialState;

export const selectRealEstate = createSelector([selectSlice], state => state);
