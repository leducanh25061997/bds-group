import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ProcessManagementSaga } from './saga';
import {
  PayloadCreateWorkFlow,
  PayloadGetDetailWorkFlow,
  PayloadUpdateWorkFlow,
  ProcessItem,
  ProcessManagementState,
} from './type';

export const initialState: ProcessManagementState = {};

const slice = createSlice({
  name: 'processManagementSlice',
  initialState,
  reducers: {
    fetchListProcess(state, action) {
      state.isLoading = true;
    },
    fetchListProcessSuccess: (
      state,
      action: PayloadAction<Pageable<ProcessItem>>,
    ) => {
      state.processManagement = action.payload;
      state.isLoading = false;
    },

    createWorkFlow: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateWorkFlow, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createWorkFlowSuccess: () => {},

    getDetailWorkFlow(state, action) {
      state.isLoading = true;
    },
    getDetailWorkFlowSuccess: (state, action) => {
      state.isLoading = false;
      state.WorkFlowDetail = action.payload;
    },

    deleteWorkFlow: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadGetDetailWorkFlow, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    deleteWorkFlowSuccess: () => {},

    updateWorkFlowTree: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateWorkFlow, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateWorkFlowTreeSuccess: () => {},

    clearDataProcess(state) {
      state.WorkFlowDetail = null;
    },
  },
});

export const useProcessManagementSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ProcessManagementSaga });
  return { actions: slice.actions };
};

export const { actions: processManagementActions } = slice;
