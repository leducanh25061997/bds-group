import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PropertyType } from 'types/Property';

import { EsalekitItem } from 'types/Esalekit';

import { EsalekitSaga } from './saga';

import {
  EsalekitState,
  PayloadCreateGallery,
  PayloadCreateHeadTab,
  PayloadCreateLeftTab,
  PayloadGetEsalekit,
  PayloadUpdateHeadTab,
  PayloadUpdateLeftTab,
  PayloadCreateGround,
  PayloadCreateContent,
  PayloadCreateConsultation,
} from './types';

export const initialState: EsalekitState = {};

const slice = createSlice({
  name: 'EsalekitSlice',
  initialState,
  reducers: {
    getEsalekit(state, action) {
      state.isLoading = true;
    },
    getEsalekitSuccess: (state, action) => {
      state.isLoading = false;
      state.EsalekitDetail = action.payload;
    },

    getLefttab(state, action) {
      state.isLoading = true;
    },
    getLefttabSuccess: (state, action) => {
      state.isLoading = false;
      state.LeftTabDetail = action.payload;
    },

    getHeadertab(state, action) {
      state.isLoading = true;
    },
    getHeadertabSuccess: (state, action) => {
      state.isLoading = false;
      state.HeaderDetail = action.payload;
    },

    getGalleryHeader(state, action) {
      state.isLoading = true;
    },
    getGalleryHeaderSuccess: (state, action) => {
      state.isLoading = false;
      state.GalleryHeaderManager = action.payload;
    },

    getGalleryType(state, action) {
      state.isLoading = true;
    },
    getGalleryTypeSuccess: (state, action) => {
      state.isLoading = false;
      state.GalleryHeaderType = action.payload;
    },

    getAllGallery(state, action) {
      state.isLoading = true;
    },
    getAllGallerySuccess: (state, action) => {
      state.isLoading = false;
      state.AllGalleryManager = action.payload;
    },

    deleteGallery: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadGetEsalekit, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    deleteGallerySuccess: () => {},

    deleteLeftTab: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadGetEsalekit, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    deleteLeftTabSuccess: () => {},
    deleteHeaderTab: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadGetEsalekit, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    deleteHeaderTabSuccess: () => {},
    createLeftTab: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateLeftTab, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createLeftTabSuccess(state) {
      state.isLoading = false;
    },
    createHeaderTab: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateHeadTab, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createHeaderTabSuccess(state) {
      state.isLoading = false;
    },

    createGallery: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateGallery, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createGallerySuccess(state) {
      state.isLoading = false;
    },

    createContent: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateContent, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createContentSuccess(state) {
      state.isLoading = false;
    },

    createGround: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateGround, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createGroundSuccess(state) {
      state.isLoading = false;
    },

    updateLeftTab: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateLeftTab, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateLeftTabSuccess() {},

    changeAvatarGallery: {
      reducer(state) {
        return state;
      },
      prepare(params: string, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    changeAvatarGallerySuccess() {},
    
    updateHeadTab: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateHeadTab, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateHeadTabSuccess() {},
    clearDataEsalekit(state) {
      state.EsalekitDetail = null;
    },
    clearDataGallery(state) {
      state.GalleryHeaderManager = [];
    },
    clearDataGalleryType(state) {
      state.GalleryHeaderType = [];
    },
    removeFileAttachment(state, action) {
      state.EsalekitDetail = action.payload;
    },

    createConsultant: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateConsultation, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createConsultantSuccess(state) {
      state.isLoading = false;
    },
  },
});

export const useEsalekitSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: EsalekitSaga });
  return { actions: slice.actions };
};

export const { actions: EsalekitActions } = slice;
