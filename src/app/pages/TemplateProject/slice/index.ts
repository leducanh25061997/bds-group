import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';

import {
  PayloadCreateFileDocument,
  PayloadDeleteTemplateDocumentPrint,
  PayloadGetDocumentPrintDetail,
  PayloadUpdateFileDocument,
  TemplateProjectManagementState,
  fileDocumentitem,
  PayloadCreateTemplateEmailAndSms,
  ProviderSMS,
} from './types';
import { managementTemplateSaga } from './saga';

export const initialState: TemplateProjectManagementState = {
  isLoading: {},
};

const slice = createSlice({
  name: 'managementTemplateProjectSlice',
  initialState,
  reducers: {
    fetchListTemplateDocument: (state, action) => {
      // state.isLoading = true;
      if (!action.payload?.skipLoading) {
        state.isLoading = { ...state.isLoading, [action.type]: true };
      }
    },
    fetchListTemplateDocumentSuccess: (
      state,
      action: PayloadAction<Pageable<fileDocumentitem>>,
    ) => {
      const fetchListTemplateDocumentActionType =
        'managementTemplateProjectSlice/fetchListTemplateDocument';
      // state.isLoading = false;
      state.isLoading = {
        ...state.isLoading,
        [fetchListTemplateDocumentActionType]: false,
      };
      state.documentManagement = action.payload;
    },
    createTemplateDocument: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateFileDocument, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createTemplateDocumentSuccess: () => {},
    getDetailDocumentPrint: (
      state,
      action: PayloadAction<PayloadGetDocumentPrintDetail>,
    ) => {
      // state.isLoading = true;
      state.isLoading = { ...state.isLoading, [action.type]: true };
    },
    getDetailDocumentPrintSuccess: (state, action) => {
      // state.isLoading = false;
      const getDetailDocumentPrintActionType =
        'managementTemplateProjectSlice/getDetailDocumentPrint';
      state.isLoading = {
        ...state.isLoading,
        [getDetailDocumentPrintActionType]: false,
      };
      state.documentPrintDetail = action.payload;
    },
    clearDataDocumentDetail: state => {
      state.documentPrintDetail = undefined;
    },
    deleteTemplateDocumentPrint: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadDeleteTemplateDocumentPrint,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    deleteTemplateDocumentPrintSuccess: () => {},
    updateTemplateDocumentPrint: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateFileDocument, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateTemplateDocumentPrintSuccess: () => {},
    createTemplateEmailAndSMS: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadCreateTemplateEmailAndSms,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    fetchListTemplateEmailAndSms: (state, action) => {
      // state.isLoading = true;
      if (!action.payload?.skipLoading) {
        state.isLoading = { ...state.isLoading, [action.type]: true };
      }
    },
    fetchListTemplateEmailSuccess: (
      state,
      action: PayloadAction<Pageable<PayloadCreateTemplateEmailAndSms>>,
    ) => {
      state.templateEmailManagement = action.payload;
      // state.isLoading = false;
      const fetchListTemplateEmailAndSmsActionType =
        'managementTemplateProjectSlice/fetchListTemplateEmailAndSms';
      state.isLoading = {
        ...state.isLoading,
        [fetchListTemplateEmailAndSmsActionType]: false,
      };
    },
    fetchListTemplateSMSSuccess: (
      state,
      action: PayloadAction<Pageable<PayloadCreateTemplateEmailAndSms>>,
    ) => {
      state.templateSMSManagement = action.payload;
      // state.isLoading = false;
      const fetchListTemplateEmailAndSmsActionType =
        'managementTemplateProjectSlice/fetchListTemplateEmailAndSms';
      state.isLoading = {
        ...state.isLoading,
        [fetchListTemplateEmailAndSmsActionType]: false,
      };
    },
    deleteTemplateEmailAndSms: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadCreateTemplateEmailAndSms,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateTemplateEmailAndSMS: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadCreateTemplateEmailAndSms,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    clearListTemplateProject(state) {
      state.documentManagement = undefined;
      state.templateEmailManagement = undefined;
      state.templateSMSManagement = undefined;
    },
    fetchListProviderSMS: (state, action) => {
      // state.isLoading = true;
      state.isLoading = { ...state.isLoading, [action.type]: true };
    },
    fetchListProviderSMSSuccess: (
      state,
      action: PayloadAction<Pageable<ProviderSMS>>,
    ) => {
      state.listProviderSMS = action.payload;
      // state.isLoading = false;
      const fetchListProviderSMSActionType =
        'managementTemplateProjectSlice/fetchListProviderSMS';
      state.isLoading = {
        ...state.isLoading,
        [fetchListProviderSMSActionType]: false,
      };
    },
  },
});
export const { actions: managementTemplateActions } = slice;
export const useManagementTemplateSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: managementTemplateSaga });
  return { actions: slice.actions };
};
