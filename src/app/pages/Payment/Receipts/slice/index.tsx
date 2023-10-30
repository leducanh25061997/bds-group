import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { receiptsSaga } from './saga';
import {
  ApproveReceiptRequest,
  CancelReceiptRequest,
  ReceiptsResponse,
  receiptState,
} from './types';

export const initialState: receiptState = {
  isLoading: false,
  isLoadingInfor: false,
  receiptsApprove: undefined,
  receiptsWaitting: undefined,
};

const slice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    clearDataReceiptApprove(state) {
      state.receiptsApprove = undefined;
      state.isLoading = false;
    },
    fetchReceiptsApprove(state, action) {
      state.receiptsApprove = undefined;
      state.isLoading = true;
    },
    fetchReceiptsApproveSuccess: (
      state,
      action: PayloadAction<Pageable<ReceiptsResponse>>,
    ) => {
      state.receiptsApprove = action.payload;
      state.isLoading = false;
    },
    fetchReceiptsApproveFaild(state) {
      state.isLoading = false;
    },

    clearDataReceiptWaitting(state) {
      state.receiptsWaitting = undefined;
      state.isLoading = false;
    },
    fetchReceiptsWaitting(state, action) {
      state.receiptsWaitting = undefined;
      state.isLoading = true;
    },
    fetchReceiptsWaittingSuccess: (
      state,
      action: PayloadAction<Pageable<ReceiptsResponse>>,
    ) => {
      state.receiptsWaitting = action.payload;
      state.isLoading = false;
    },
    fetchReceiptsWaittingFaild(state, action) {
      state.receiptsWaitting = action.payload;
      state.isLoading = false;
    },

    fetchReceiptInformation(state, action: PayloadAction<string>) {
      state.isLoadingInfor = true;
      state.receiptInformation = null;
    },
    fetchReceiptInformationSuccess: (
      state,
      action: PayloadAction<ReceiptsResponse>,
    ) => {
      state.receiptInformation = action.payload;
      state.isLoadingInfor = false;
    },
    fetchReceiptInformationFaild(state) {
      state.isLoadingInfor = false;
    },

    approveReceiptFormData: {
      reducer(state) {
        return state;
      },
      prepare(params: ApproveReceiptRequest, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    approveReceiptFormDataSuccess: () => {},

    cancelReceiptFormData: {
      reducer(state) {
        return state;
      },
      prepare(params: CancelReceiptRequest, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    cancelReceiptFormDataSuccess: () => {},

    fetchReceiptsApproveNoLoading(state, action) {},

    fetchReceiptsApproveNoLoadingSuccess: (
      state,
      action: PayloadAction<Pageable<ReceiptsResponse>>,
    ) => {
      state.receiptsApprove = action.payload;
    },
    fetchReceiptsApprovesNoLoadingFaild(state) {},

    fetchReceiptsWaittingNoLoading(state, action) {},

    fetchReceiptsWaittingNoLoadingSuccess: (
      state,
      action: PayloadAction<Pageable<ReceiptsResponse>>,
    ) => {
      state.receiptsWaitting = action.payload;
    },
    fetchReceiptsWaittingNoLoadingFaild(state) {},

    updateParamsSearch(state, action: PayloadAction<FilterParams>) {
      state.paramsSearch = action.payload;
    },
    clearParamsSearch(state) {
      state.paramsSearch = undefined;
    },

    setTicketIdStore(state, action: PayloadAction<string>) {
      state.ticketId = action.payload;
    },

    clearTicketStore(state) {
      state.ticketId = undefined;
    },
  },
});

export const { actions: receiptsActions } = slice;

export const usePaymentSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: receiptsSaga });
  return { actions: slice.actions };
};
