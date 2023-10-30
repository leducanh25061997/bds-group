import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { OrgchartItem } from 'types/Orgchart';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PropertyType } from 'types/Property';
import { Sector } from 'types/RealEstate';

import { OrgchartSaga } from './saga';

import {
  OrgchartState,
  PayloadCreateOrgchart,
  PayloadUpdateStatusOrgchart,
  PayloadUpdateOrgchart,
  AssetSector,
} from './types';
import { StaffItem } from 'types/Staff';

export const initialState: OrgchartState = {};

const slice = createSlice({
  name: 'OrgchartSlice',
  initialState,
  reducers: {
    fetchListOrgchart(state) {
      state.isLoading = true;
    },
    fetchListOrgchartSuccess: (
      state,
      action: PayloadAction<Pageable<OrgchartItem>>,
    ) => {
      state.isLoading = false;
      state.OrgchartManagement = action.payload;
    },
    fetchListOrgchartFilter(state, action) {
      state.isLoading = true;
    },
    fetchListOrgchartFilterSuccess: (
      state,
      action: PayloadAction<Pageable<OrgchartItem>>,
    ) => {
      state.isLoading = false;
      state.OrgchartManagementFilter = action.payload;
    },
    createOrgchart: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateOrgchart, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createOrgchartSuccess() {},
    getDetailOrgchart(state, action) {
      state.isLoading = true;
    },
    getDetailOrgchartSuccess: (state, action) => {
      state.isLoading = false;
      state.OrgchartDetail = action.payload;
    },
    fetchListStaffOrgchart(state, action) {
      state.isLoading = true;
    },
    fetchListStaffOrgchartSuccess: (
      state,
      action: PayloadAction<Pageable<StaffItem>>,
    ) => {
      state.isLoading = false;
      state.StaffOrgChart = action.payload;
    },
    getStaffNoneOrgchart() {},
    getStaffNoneOrgchartSuccess: (state, action) => {
      state.isLoading = false;
      state.StaffNoneOrgchart = action.payload;
    },
    updateStatusOrgchart: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadUpdateStatusOrgchart,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateStatusOrgchartSuccess() {},
    updateDataOrgchart: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateOrgchart, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataOrgchartSuccess: () => {},
    clearDataOrgchart(state) {
      state.OrgchartDetail = null;
    },
    getAssetSector(state, action) {},
    getAssetSectorSuccess: (state, action: PayloadAction<AssetSector>) => {
      state.assetSector = action.payload;
    },
  },
});

export const useOrgchartSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: OrgchartSaga });
  return { actions: slice.actions };
};

export const { actions: customerActions } = slice;
