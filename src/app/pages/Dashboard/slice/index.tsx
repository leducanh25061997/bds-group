import { createSlice } from 'utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { dashboardSaga } from './saga';

import { DashboardsState } from './types';

export const initialState: DashboardsState = {
  hasUpdateInfo: false,
};

const dashboardSlice = createSlice({
  name: 'dashboardsSlice',
  initialState,
  reducers: {
    hasInformation: (state, action) => {},
    hasInformationSuccess: (state, action) => {
      state.hasUpdateInfo = action.payload;
    },
  },
});

export const useDashboardSlice = () => {
  useInjectReducer({
    key: dashboardSlice.name,
    reducer: dashboardSlice.reducer,
  });
  useInjectSaga({
    key: dashboardSlice.name,
    saga: dashboardSaga,
  });

  return { actions: dashboardSlice.actions };
};

export const { actions: dashboardAction } = dashboardSlice;
