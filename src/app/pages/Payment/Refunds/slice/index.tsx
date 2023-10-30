import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { refundsSaga } from './saga';
import {
  ApproveRefundRequest,
  CancelRefundRequest,
  RefundsResponse,
  refundState,
} from './types';

export const initialState: refundState = {
  isLoading: false,
  isLoadingInfor: false,
  refundsApprove: undefined,
  refundsWaitting: undefined,
};

const slice = createSlice({
  name: 'refunds',
  initialState,
  reducers: {
    clearDataRefundApprove(state) {
      state.refundsApprove = undefined;
      state.isLoading = false;
    },
    fetchRefundApprove(state, action) {
      state.refundsApprove = undefined;
      state.isLoading = true;
    },
    fetchRefundApproveSuccess: (
      state,
      action: PayloadAction<Pageable<RefundsResponse>>,
    ) => {
      state.refundsApprove = action.payload;
      state.isLoading = false;
    },
    fetchRefundApproveFaild(state) {
      state.isLoading = false;
    },

    clearDataRefundWaiting(state) {
      state.refundsWaitting = undefined;
      state.isLoading = false;
    },
    fetchRefundWaiting(state, action) {
      state.refundsWaitting = undefined;
      state.isLoading = true;
    },
    fetchRefundWaitingSuccess: (
      state,
      action: PayloadAction<Pageable<RefundsResponse>>,
    ) => {
      state.refundsWaitting = action.payload;
      state.isLoading = false;
    },
    fetchRefundWaitingFaild(state) {
      state.isLoading = false;
    },

    fetchRefundInformation(state, action: PayloadAction<string>) {
      state.isLoadingInfor = true;
      state.refundInformation = null;
    },
    fetchRefundInformationSuccess: (
      state,
      action: PayloadAction<RefundsResponse>,
    ) => {
      state.refundInformation = action.payload;
      state.isLoadingInfor = false;
    },
    fetchRefundInformationFaild(state) {
      state.isLoadingInfor = false;
    },

    approveRefundFormData: {
      reducer(state) {
        return state;
      },
      prepare(params: ApproveRefundRequest, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    approveRefundFormDataSuccess: () => {},

    cancelRefundFormData: {
      reducer(state) {
        return state;
      },
      prepare(params: CancelRefundRequest, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    cancelRefundFormDataSuccess: () => {},

    updateParamsSearch(state, action: PayloadAction<FilterParams>) {
      state.paramsSearch = action.payload;
    },
    clearParamsSearch(state) {
      state.paramsSearch = undefined;
    },
  },
});

export const { actions: refundsActions } = slice;

export const useRefundSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: refundsSaga });
  return { actions: slice.actions };
};
