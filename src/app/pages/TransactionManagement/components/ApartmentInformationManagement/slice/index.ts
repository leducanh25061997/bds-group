import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { OrgchartItem } from 'types/Orgchart';

import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { managementInformationSaga } from './saga';
import {
  ApartmentInformation,
  ApartmentInformationSParams,
  ApartmentInformationState,
  ChangeOrgChartProductRequest,
  MoveProductToSaleProgramParams,
  OpenPriorityAdditionalRequest,
  ProductsCanOrderFilter,
  SettingTableProduct,
  TableProductInformation,
  UpdateNoteParams,
  UpdateStatusTableProductParams,
  UpdateStatusProductCustomerParams,
} from './types';

export const initialState: ApartmentInformationState = {
  apartmentInformation: null,
  settingTableProduct: [],
};

const slice = createSlice({
  name: 'apartmentInformation',
  initialState,
  reducers: {
    fetchDatatable(state, action: PayloadAction<ApartmentInformationSParams>) {
      // state.apartmentInformation = null;
    },
    fetchDatatableSuccess: (
      state,
      action: PayloadAction<ApartmentInformation>,
    ) => {
      state.apartmentInformation = action.payload;
    },

    fetchSettingTableProduct(
      state,
      action: PayloadAction<ApartmentInformationSParams>,
    ) {},
    fetchSettingTableProductSuccess: (
      state,
      action: PayloadAction<SettingTableProduct[]>,
    ) => {
      state.settingTableProduct = action.payload;
    },

    fetchTableProductInformation(state, action: PayloadAction<string>) {},
    fetchTableProductInformationSuccess: (
      state,
      action: PayloadAction<TableProductInformation>,
    ) => {
      state.tableProductInformation = action.payload;
    },

    handleClearDataTableProductInformation(state) {
      state.tableProductInformation = null;
    },

    updateStatusTableProductSuccess: () => {},
    updateStatusTableProduct: {
      reducer(state) {
        return state;
      },
      prepare(
        params: UpdateStatusTableProductParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },

    lockTableProductSuccess: () => {},
    lockTableProduct: {
      reducer(state) {
        return state;
      },
      prepare(
        params: UpdateStatusTableProductParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },

    unlockTableProductSuccess: () => {},
    unlockTableProduct: {
      reducer(state) {
        return state;
      },
      prepare(
        params: UpdateStatusTableProductParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },

    handleSelectBlock(state, { payload }) {
      state.selectedBlock = payload;
    },

    changeOrgChartProductSuccess: () => {},
    changeOrgChartProduct: {
      reducer(state) {
        return state;
      },
      prepare(
        params: ChangeOrgChartProductRequest,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    setFilterDatatableSearchKey: (
      state,
      action: PayloadAction<{ code: string }>,
    ) => {
      if (state.filterDatatable) {
        state.filterDatatable = {
          ...state.filterDatatable,
          code: action.payload.code,
        };
      }
    },
    setFilterDatatable: (
      state,
      action: PayloadAction<ApartmentInformationSParams>,
    ) => {
      const oldSearch = state.filterDatatable?.code;
      state.filterDatatable = action.payload;
      if (oldSearch) state.filterDatatable.code = oldSearch;
    },

    fetchProductInformation(state, action: PayloadAction<string>) {
      state.productInformation = null;
    },
    fetchProductInformationSuccess: (state, action: PayloadAction<any>) => {
      state.tableProductInformation = action.payload;
    },
    fetchProductInformationFaild: (state, action) => {
      state.tableProductInformation = null;
    },

    fetchProductCanOrder(
      state,
      action: PayloadAction<ProductsCanOrderFilter>,
    ) {},
    fetchProductCanOrderSuccess: (
      state,
      action: PayloadAction<TableProductInformation[]>,
    ) => {
      state.productCanOrderPrototype = action.payload;
    },

    createPostOpenPriorityAdditional: {
      reducer(state) {
        return state;
      },
      prepare(
        params: OpenPriorityAdditionalRequest,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    createPostOpenPriorityAdditionalSuccess: () => {},

    fetchListOrgchart(state, action: PayloadAction<string>) {},
    fetchListOrgchartSuccess: (
      state,
      action: PayloadAction<Pageable<OrgchartItem>>,
    ) => {
      state.OrgchartManagement = action.payload;
    },

    updateNoteTableProductSuccess: () => {},
    updateNoteTableProduct: {
      reducer(state) {
        return state;
      },
      prepare(params: UpdateNoteParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    moveProductToSaleProgram: {
      reducer(state) {
        return state;
      },
      prepare(
        params: MoveProductToSaleProgramParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    moveProductToSaleProgramSuccess: () => {},

    updateStatusProductCustomer: {
      reducer(state) {
        return state;
      },
      prepare(
        params: UpdateStatusProductCustomerParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },

    removeProductToSaleProgram: {
      reducer(state) {
        return state;
      },
      prepare(
        params: MoveProductToSaleProgramParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
  },
});

export const { actions: apartmentInformationActions } = slice;

export const useApartmentInformationsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: managementInformationSaga });
  return { actions: slice.actions };
};
