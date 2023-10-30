import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from '.';

const selectSlice = (state: RootState) => state.settingSlice || initialState;

export const selectSetting = createSelector([selectSlice], state => state);
