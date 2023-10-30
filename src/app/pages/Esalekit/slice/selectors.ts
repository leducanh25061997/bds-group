import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.EsalekitSlice || initialState;

export const selectEsalekit = createSelector([selectSlice], state => state);
