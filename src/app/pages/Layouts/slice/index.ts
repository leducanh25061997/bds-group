import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';

import { LayoutsState } from './types';

export const initialState: LayoutsState = {};

const slice = createSlice({
  name: 'layouts',
  initialState,
  reducers: {
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
    showSidebar(state, { payload }) {
      state.isShowSidebar = payload;
    },
    showFilter(state, { payload }) {
      state.isShowFilter = payload;
    },
    showRightBar(state, { payload }) {
      state.apartmentInformation = payload;
    },
    handleShowBunble(state, { payload }) {
      state.isMultipleSelectTable = payload;
    }
  },
});

export const { actions: layoutsActions } = slice;

export const useLayoutsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
