import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { kpiMissionSaga } from './saga';

import {
  KpiMissionState,
  MissionAssignedItem,
  PayloadCreateKpiMission,
  PayloadGetDetailKpiMission,
  PayloadGetStatisticKpi,
  PayloadUpdateKpiMission,
} from './types';

export const initialState: KpiMissionState = {};

const slice = createSlice({
  name: 'kpiMissionSlice',
  initialState,
  reducers: {
    fetchListMissionAssigned(state, action) {
      state.isLoading = true;
    },
    fetchListMissionAssignedSuccess: (
      state,
      action: PayloadAction<Pageable<MissionAssignedItem>>,
    ) => {
      state.missionAssignManager = action.payload;
      state.isLoading = false;
    },
    clearListMissionAssigned(state) {
      state.missionAssignManager = undefined;
    },
    getDetailKpiMission: (
      state,
      action: PayloadAction<PayloadGetDetailKpiMission>,
    ) => {
      state.isLoading = true;
    },
    getDetailKpiMissionSuccess: (state, action) => {
      state.isLoading = false;
      state.detailKpiMission = action.payload;
    },
    clearDetailKpiMission: state => {
      state.detailKpiMission = undefined;
    },
    createKpiMission: {
      reducer(state) {
        state.isLoading = true;
        return state;
      },
      prepare(params: PayloadCreateKpiMission, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createKpiMissionSuccess: state => {
      state.isLoading = false;
    },
    updateKpiMission: {
      reducer(state) {
        state.isLoading = true;
        return state;
      },
      prepare(params: PayloadUpdateKpiMission, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateKpiMissionSuccess: state => {
      state.isLoading = false;
    },

    getListStatisticKpi: (
      state,
      action: PayloadAction<PayloadGetStatisticKpi>,
    ) => {
      state.isLoading = true;
    },
    getListStatisticKpiSuccess: (state, action) => {
      state.isLoading = false;
      state.statisticKpi = action.payload;
    },
    getHandleKpiMission: {
      reducer(state) {
        state.isLoading = true;
        return state;
      },
      prepare(params: PayloadGetDetailKpiMission, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    getHandleKpiMissionSuccess: state => {
      state.isLoading = false;
    },
    getListDetailStatisticKpi: (
      state,
      action: PayloadAction<PayloadGetStatisticKpi>,
    ) => {
      state.isLoadingDetaiilStatistic = true;
    },
    getListDetailStatisticKpiSuccess: (state, action) => {
      state.isLoadingDetaiilStatistic = false;
      state.detailStatisticKpi = action.payload;
    },
    clearGetListDetailStatisticKpi: state => {
      state.detailStatisticKpi = undefined;
    },
  },
});

export const useKpiMissionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: kpiMissionSaga });
  return { actions: slice.actions };
};

export const { actions: kpiMissionActions } = slice;
