import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PayloadUploadGroundProductTable } from 'app/pages/ProductTableSetting/slice/types';

import { GroundProductTableData, GroundProductTableState } from './types';
import { groundProductTableSaga } from './saga';

export const initialState: GroundProductTableState = {
  isLoading: false,
};

const slice = createSlice({
  name: 'groundProductTable',
  initialState,
  reducers: {
    getGroundProductTable: {
      reducer(state) {
        state.isLoading = true;
        return state;
      },
      prepare(params: { id: string }, meta?: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    getGroundProductTableSuccess: (
      state,
      action: PayloadAction<GroundProductTableData>,
    ) => {
      state.groundProductTableData = action.payload;
      state.isLoading = false;
    },
    createGroundProductTable: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadUploadGroundProductTable,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    createGroundProductTableSuccess: () => {},
    clearGroundProductTable: state => {
      state.groundProductTableData = null;
    },
  },
});

export const { actions: groundProductTableActions } = slice;

export const useGroundProductTableSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: groundProductTableSaga });
  return { actions: slice.actions };
};
