import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ComisstionItem } from 'types/User';

import { ComisstionPolicy } from 'types/Comisstion';

import {
  ComisstionPolicyState,
  PayloadCreateComisstionPolicy,
  PayloadUpdateStatusComisstion,
  RoleData,
} from './types';

import { ComisstionSaga } from './saga';

export const initialState: ComisstionPolicyState = {};

const slice = createSlice({
  name: 'ComisstionPolicySlice',
  initialState,
  reducers: {
    fetchListComisstion(state, action) {
      state.isLoading = true;
    },
    fetchListComisstionPolicySuccess: (
      state,
      action: PayloadAction<Pageable<ComisstionPolicy>>,
    ) => {
      state.ComisstionManagement = action.payload;
      state.isLoading = false;
    },

    fetchListComisstionInactive(state, action) {
      state.isLoading = true;
    },
    fetchListComisstionPolicyInactiveSuccess: (
      state,
      action: PayloadAction<Pageable<ComisstionPolicy>>,
    ) => {
      state.ComisstionManagementInactive = action.payload;
      state.isLoading = false;
    },
    updateStatusComisstion: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadUpdateStatusComisstion,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateStatusComisstionSuccess: () => {},
    getDetailComisstion(state, action) {
      state.isLoading = true;
    },
    getDetailComisstionSuccess: (state, action) => {
      state.isLoading = false;
      state.ComisstionPolicyDetail = action.payload;
    },
    createComisstion: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadCreateComisstionPolicy,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    createComisstionSuccess: () => {},
    fetchRoleList() {},
    fetchRoleListSuccess: (state, action: PayloadAction<RoleData[]>) => {
      state.roleList = action.payload;
    },
    clearDataComisstion(state) {
      // state.ComisstionPolicyDetail = null;
    },
    removeFileAttachment(state, action) {
      state.ComisstionPolicyDetail = action.payload;
    },
    updateDataComisstion: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadCreateComisstionPolicy,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateDataComisstionSuccess: () => {},
    updateDataAdmin: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadCreateComisstionPolicy,
        meta: (error?: any) => void,
      ) {
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

    getListManagementeData(state, action) {
      state.isLoading = true;
    },
    getListManagementeDataSuccess(state, action) {
      state.managermentList = action.payload;
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

export const useComisstionPolicySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ComisstionSaga });
  return { actions: slice.actions };
};

export const { actions: ComisstionActions } = slice;
