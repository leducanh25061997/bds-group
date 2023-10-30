import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { CustomerItem } from 'types/User';

import {
  LogImportCustomerState,
} from './types';

import { LogImportCustomerSaga } from './saga';

export const initialState: LogImportCustomerState = {};

const slice = createSlice({
  name: 'logImportCustomerSlice',
  initialState,
  reducers: {
    fetchListLogImportCustomer(state, action) {
      state.isLoading = true;
    },
    logImportCustomerListSuccess: (state, action) => {
      state.isLoading = false;
      state.dataLog = action.payload;
    },
  },
});

export const useLogImportCustomerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: LogImportCustomerSaga });
  return { actions: slice.actions };
};

export const { actions: importCustomerActions } = slice;
