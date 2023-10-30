import { FilterParams, UpdateVirtualStatusParams, VirtualTableState } from "./types";
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductDataTable, ProductTableParams } from "types/ProductTable";
import { SettingTableProduct } from '../../TransactionManagement/components/ApartmentInformationManagement/slice/types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { virtualTableSaga } from "./saga";

export const initialState: VirtualTableState = {
  settingTableProduct: [],
  virtualDataTable: null,
};

const slice = createSlice({
  name: 'virtualTable',
  initialState,
  reducers: {
    fetchSettingTableProduct(
      state,
      action: PayloadAction<ProductTableParams>,
    ) {},
    fetchSettingTableProductSuccess: (
      state,
      action: PayloadAction<SettingTableProduct[]>,
    ) => {
      state.settingTableProduct = action.payload;
    },

    fetchDatatable(state, action: PayloadAction<ProductTableParams>) {
      // state.apartmentInformation = null;
    },
    fetchDatatableSuccess: (
      state,
      action: PayloadAction<ProductDataTable>,
    ) => {
      state.virtualDataTable = action.payload;
    },

    handleFilter(state, { payload }) {
      state.filterParams = payload;
    },

    updateVirtualStatus: {
      reducer(state) {
        return state;
      },
      prepare(
        params: UpdateVirtualStatusParams,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
  }
});

export const { actions: virtualTableActions } = slice;

export const useVirtualTableSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: virtualTableSaga });
  return { actions: slice.actions };
};
