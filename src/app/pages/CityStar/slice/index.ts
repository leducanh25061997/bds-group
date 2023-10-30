import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { CityStarItem, MembershipItem } from 'types/CityStar';

import {
  CityStarState,
  PayloadCheckExistCode,
  PayloadActiveMembership,
  PayloadPostCodeGenerate,
} from './types';

import { CityStarSaga } from './saga';

export const initialState: CityStarState = {};

const slice = createSlice({
  name: 'CityStarSlice',
  initialState,
  reducers: {
    fetchListCityStar(state, action) {
      state.isLoading = true;
    },
    fetchListCityStarSuccess: (
      state,
      action: PayloadAction<Pageable<MembershipItem>>,
    ) => {
      state.CityStarManagement = action.payload;
      state.isLoading = false;
    },

    fetchListCustomerCityStar(state, action) {
      state.isLoading = true;
    },
    fetchListCustomerCityStarSuccess: (
      state,
      action: PayloadAction<Pageable<CityStarItem>>,
    ) => {
      state.CustomerCityStarManagement = action.payload;
      state.isLoading = false;
    },

    checkCustomerExist: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCheckExistCode, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },

    checkCustomerExistSuccess: state => {
      state.isLoading = false;
    },

    activeMembership: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadActiveMembership, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    activeMembershipSuccess(state) {
      state.isLoading = false;
    },

    postCodeGenerate: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadPostCodeGenerate, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    postCodeGenerateSuccess(state) {
      state.isLoading = false;
    },

    getDetailMembership(state, action) {
      state.isLoading = true;
    },
    getDetailMembershipSuccess: (state, action) => {
      state.isLoading = false;
      state.membershipDetail = action.payload;
    },

    getDetailMembershipActive(state, action) {
      state.isLoading = true;
    },
    getDetailMembershipActiveSuccess: (state, action) => {
      state.isLoading = false;
      state.membershipActiveDetail = action.payload;
    },
  },
});

export const useCityStarSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: CityStarSaga });
  return { actions: slice.actions };
};

export const { actions: CityStarActions } = slice;
