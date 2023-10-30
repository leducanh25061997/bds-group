import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { RealEstateItem } from 'types/RealEstate';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PropertyType } from 'types/Property';

import { realEstateSaga } from './saga';

import {
  RealEstateState,
  PayloadCreateRealEstate,
  PayloadUpdateStatusRealEstate,
  PayloadUpdateRealEstate,
} from './types';

export const initialState: RealEstateState = {};

const slice = createSlice({
  name: 'realEstateSlice',
  initialState,
  reducers: {
    fetchListRealEstates(state, action) {
      state.isLoading = true;
    },
    fetchListRealEstatesSuccess: (
      state,
      action: PayloadAction<Pageable<RealEstateItem>>,
    ) => {
      state.realEstateManager = action.payload;
      state.isLoading = false;
    },
    createRealEstate: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateRealEstate, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createRealEstateSuccess(state) {
      state.isLoading = false;
    },
    fetchListViewsType() {},
    fetchListViewsTypeSuccess: (
      state,
      action: PayloadAction<PropertyType[]>,
    ) => {
      const listPropertyCover: PropertyType[] = [];
      action.payload.forEach(item => {
        listPropertyCover.push({
          value: item.id + '',
          key: item.name,
          id: item.id,
          description: item.name,
          name: item.name,
        });
      });
      state.listPropertyViewsType = listPropertyCover;
    },
    fetchListFactorsType() {},
    fetchListFactorsTypeSuccess: (
      state,
      action: PayloadAction<PropertyType[]>,
    ) => {
      const listPropertyCover: PropertyType[] = [];
      action.payload.forEach(item => {
        listPropertyCover.push({
          value: item.id + '',
          key: item.name,
          id: item.id,
          description: item.name,
          name: item.name,
        });
      });
      state.listPropertyFactorsType = listPropertyCover;
    },
    fetchListRealEstateProject() {},
    fetchListRealEstateProjectSuccess(
      state,
      action: PayloadAction<PropertyType[]>,
    ) {
      const listPropertyCover: PropertyType[] = [];
      action.payload.forEach(item => {
        listPropertyCover.push({
          value: item.id + '',
          key: item.name,
          id: item.id,
          description: item.name,
          name: item.name,
        });
      });
      state.listRealEstateProject = listPropertyCover;
    },
    fetchListRealEstateFrontageAdvantage() {},
    fetchListRealEstateFrontageAdvantageSuccess(
      state,
      action: PayloadAction<PropertyType[]>,
    ) {
      const listPropertyCover: PropertyType[] = [];
      action.payload.forEach(item => {
        listPropertyCover.push({
          value: item.id + '',
          key: item.name,
          id: item.id,
          description: item.name,
          name: item.name,
        });
      });
      state.listRealEstateFrontageAdvantage = listPropertyCover;
    },
    getDetailRealEstate(state, action) {
      state.isLoading = true;
    },
    getDetailRealEstateSuccess: (state, action) => {
      state.isLoading = false;
      state.realEstateDetail = action.payload;
    },
    updateStatusRealEstate: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadUpdateStatusRealEstate,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    updateStatusRealEstateSuccess() {},
    clearDataRealEstate(state) {
      state.realEstateDetail = null;
    },
    updateDataRealEstate: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateRealEstate, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataRealEstateSuccess: state => {
      state.isLoading = false;
    },
    removeFileAttachment(state, action) {
      state.realEstateDetail = action.payload;
    },
  },
});

export const useRealEstateSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: realEstateSaga });
  return { actions: slice.actions };
};

export const { actions: realEstateActions } = slice;
