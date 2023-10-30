import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.apartmentInformation || initialState;
export const selectApartmentInformation = createSelector(
  [selectSlice],
  state => state,
);