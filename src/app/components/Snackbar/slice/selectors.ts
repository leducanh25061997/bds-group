import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state?.snackbar || initialState;

export const selectSnackbar = createSelector([selectSlice], state => state);
