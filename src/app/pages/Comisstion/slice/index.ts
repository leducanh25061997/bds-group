import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ComisstionItem, UPloadComisstion } from 'types/User';

import {
  ComisstionState,
  PayloadCreateComisstion,
  PayloadUpdateComisstion,
  RoleData,
} from './types';

import { ComisstionSaga } from './saga';

export const initialState: ComisstionState = {};

const slice = createSlice({
  name: 'ComisstionSlice',
  initialState,
  reducers: {
    fetchListComisstion(state, action) {
      state.isLoading = true;
    },
    fetchListComisstionSuccess: (
      state,
      action: PayloadAction<Pageable<UPloadComisstion>>,
    ) => {
      state.ComisstionManagement = action.payload;
      state.isLoading = false;
    },
    updateStatusComisstion: {
      reducer(state) {
        return state;
      },
      prepare(params: any, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateStatusComisstionSuccess: () => {},
    getDetailComisstion(state, action) {
      state.isLoading = true;
    },
    getDetailComisstionSuccess: (state, action) => {
      state.isLoading = false;
      state.ComisstionDetail = action.payload;
    },
    createComisstion: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateComisstion, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createComisstionSuccess: () => {},
    fetchRoleList() {},
    fetchRoleListSuccess: (state, action: PayloadAction<RoleData[]>) => {
      state.roleList = action.payload;
    },
    clearDataComisstion(state) {
      // state.ComisstionDetail = null;
    },
    removeFileAttachment(state, action) {
      state.ComisstionDetail = action.payload;
    },
    updateDataComisstion: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateComisstion, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataComisstionSuccess: () => {},
    updateDataAdmin: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateComisstion, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataAdminSuccess: () => {},
    getStaffList(state, action) {
      state.isLoading = true;
    },
    getStaffListSuccess: (
      state,
      action: PayloadAction<Pageable<ComisstionItem>>,
    ) => {
      state.staffList = action.payload;
      state.isLoading = false;
    },
    getManager1List(state, action) {
      state.isLoading = true;
    },
    getManager1ListSuccess: (
      state,
      action: PayloadAction<Pageable<ComisstionItem>>,
    ) => {
      state.manager1List = action.payload;
      state.isLoading = false;
    },
    getManager2List(state, action) {
      state.isLoading = true;
    },
    getManager2ListSuccess: (
      state,
      action: PayloadAction<Pageable<ComisstionItem>>,
    ) => {
      state.manager2List = action.payload;
      state.isLoading = false;
    },
    resetStaffList(state) {
      state.staffList = {
        total: 0,
        data: [],
      };
    },
    resetManager1List(state) {
      state.manager1List = {
        total: 0,
        data: [],
      };
    },
    resetManager2List(state) {
      state.manager2List = {
        total: 0,
        data: [],
      };
    },

    getWorkDoneData(state, action) {
      state.isLoading = true;
    },
    getWorkDoneDataSuccess(state, action) {
      state.workDone = action.payload;
      state.isLoading = false;
    },

    getListTotalContractOrThisQuarter(state, action) {
      state.isLoading = true;
    },
    getListTotalContractOrThisQuarterSuccess(state, action) {
      state.staffList = action.payload;
      state.isLoading = false;
    },
  },
});

export const useComisstionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ComisstionSaga });
  return { actions: slice.actions };
};

export const { actions: ComisstionActions } = slice;
