import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PayloadGetWorkFlowTree } from 'app/pages/Projects/slice/types';
import { ProcessType } from 'types/Process';

import { managementInformationSaga } from './saga';
import {
  CreateInformationProjectFormData,
  CreateInformationProjectState,
  InformationProjectResponse,
  TransactionProcessData,
} from './types';

export const initialState: CreateInformationProjectState = {
  isWorkflowLoading: false,
  isInfoManagementLoading: false,
  staffs: [],
  transactionProcess: {
    reservation: [],
    deposit: [],
    canceledTicket: [],
    contract: [],
  },
};

const slice = createSlice({
  name: 'managementInformation',
  initialState,
  reducers: {
    fetchListWorkFlow(state) {
      state.isWorkflowLoading = true;
    },
    fetchListWorkFlowSuccess: (
      state,
      action: PayloadAction<TransactionProcessData>,
    ) => {
      state.isWorkflowLoading = false;
      state.transactionProcess = action.payload;
    },

    createInformationProjectFormData: {
      reducer(state) {
        state.isSubmitting = true;

        return state;
      },
      prepare(
        params: CreateInformationProjectFormData,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    createInformationProjectFormDataSuccess: state => {
      state.isSubmitting = false;
    },

    createInformationProjectFormDataError: state => {
      state.isSubmitting = false;
    },

    fetchInformationProject(state, action: PayloadAction<string>) {
      state.isInfoManagementLoading = true;
      state.informationProject = null;
    },
    fetchInformationProjectSuccess(
      state,
      action: PayloadAction<InformationProjectResponse>,
    ) {
      state.isInfoManagementLoading = false;

      state.informationProject = action.payload;
    },
    fetchInformationProjectFaild(state) {
      state.isInfoManagementLoading = false;

      state.informationProject = null;
    },

    handleSubmitFormData(state, action) {
      state.formData = action.payload;
    },

    fetchWorkFlowTree(state, action: PayloadAction<PayloadGetWorkFlowTree>) {},

    fetchWorkFlowTreeSuccess: (state, action: PayloadAction<ProcessType>) => {
      state.workFlowInformation = action.payload;
    },
    clearWorkFlowInformation: state => {
      state.workFlowInformation = null;
    },
  },
});

export const { actions: managementInformationActions } = slice;

export const useManagementInformationActionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: managementInformationSaga });
  return { actions: slice.actions };
};
