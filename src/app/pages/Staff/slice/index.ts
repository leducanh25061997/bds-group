import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { StaffItem } from 'types/Staff';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { StaffSaga } from './saga';

import { PayloadCreateStaff, PayloadUpdateStaff, StaffState } from './types';

export const initialState: StaffState = {};

const slice = createSlice({
  name: 'staffSlice',
  initialState,
  reducers: {
    fetchListStaff(state, action) {
      state.isLoading = true;
    },
    fetchListStaffSuccess: (
      state,
      action: PayloadAction<Pageable<StaffItem>>,
    ) => {
      state.staffManagement = action.payload;
      state.isLoading = false;
    },
    createStaff: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateStaff, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createStaffSuccess: () => {},
    getDetailStaff(state, action) {
      state.isLoading = true;
    },
    getDetailStaffSuccess: (state, action) => {
      state.isLoading = false;
      state.staffDetail = action.payload;
    },
    updateDataStaff: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateStaff, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataStaffSuccess: () => {},
    clearDataStaff(state) {
      state.staffDetail = null;
    },
  },
});

export const useStaffSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: StaffSaga });
  return { actions: slice.actions };
};

export const { actions: StaffActions } = slice;
