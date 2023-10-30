import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { SettingState, PayloadCommentContract } from './types';

import { contractCustomerSaga } from './saga';

export const initialState: SettingState = {};

const slice = createSlice({
  name: 'settingSlice',
  initialState,
  reducers: {
    approveContractCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: string, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    approveContractCustomerSuccess: () => {},
    refuseContractCustomer: {
      reducer(state) {
        return state;
      },
      prepare(params: string, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    refuseContractCustomerSuccess: () => {},
    commentContract: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCommentContract, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    commentContractSuccess: () => {},
    approveLiquidateContract: {
      reducer(state) {
        return state;
      },
      prepare(params: string, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    refuseLiquidateContract: {
      reducer(state) {
        return state;
      },
      prepare(params: string, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
  },
});

export const useContractCustomerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: contractCustomerSaga });
  return { actions: slice.actions };
};

export const { actions: contractActions } = slice;
