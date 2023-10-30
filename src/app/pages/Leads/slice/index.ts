import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { CustomerItem } from 'types/User';

import { LeadItem, LeadState, PayloadLeadAllotment, PayloadUpdateLead, PayloadUpdateLeadSegment } from './types';

import { leadSaga } from './saga';

export const initialState: LeadState = {};

const slice = createSlice({
  name: 'leadSlice',
  initialState,
  reducers: {
    fetchListLead(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
    fetchListLeadSuccess: (
      state,
      action: PayloadAction<Pageable<LeadItem>>,
    ) => {
      state.leadManager = action.payload;
      state.isLoading = false;
    },

    fetchListLeadTakeCare(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
   
    fetchListLeadTakeCareSuccess: (
      state,
      action: PayloadAction<Pageable<LeadItem>>,
    ) => {
      state.leadTakeCare = action.payload;
    },

    fetchListLeadAllotment(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
    
    fetchListLeadAllotmentSuccess: (
      state,
      action: PayloadAction<Pageable<LeadItem>>,
    ) => {
      state.leadManagerTrans = action.payload;
      state.isLoading = false;
    },

    fetchListLeadAlloted(state, action) {
      if (!action?.payload?.skipLoading) {
        state.isLoading = true;
      }
    },
    
    fetchListLeadAllotedSuccess: (
      state,
      action: PayloadAction<Pageable<LeadItem>>,
    ) => {
      state.leadManagerAlloted = action.payload;
      state.isLoading = false;
    },

    getSegment(state) {
      state.isLoading = true;
    },
    getSegmentSuccess: (state, action) => {
      state.isLoading = false;
      state.Segment = action.payload ?? [];
    },

    getFileImport(state) {
      state.isLoading = true;
    },
    getFileImportSuccess: (state, action) => {
      state.isLoading = false;
      state.fileImport = action.payload ?? [];
    },

    createSegment: {
      reducer(state) {
        return state;
      },
      prepare(params: { type: string }, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createSegmentSuccess(state) {
      state.isLoading = false;
    },

    updateLeadSegment: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateLeadSegment, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateLeadSegmentSuccess() {},

    updateLead: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateLead, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateLeadSuccess() {},

    updateLeadAllotment: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadLeadAllotment, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateLeadAllotmentSuccess() {},

    updateStatus: {
      reducer(state) {
        return state;
      },
      prepare(params: any, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateStatusSuccess() {},

    clearListLead(state) {
      state.leadManager = undefined;
      state.leadManagerTrans = undefined;
    },
  },
});

export const useLeadSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: leadSaga });
  return { actions: slice.actions };
};

export const { actions: leadActions } = slice;
