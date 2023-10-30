import { useInjectReducer } from 'utils/redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { SnackbarState } from './types';

export const initialState: SnackbarState = {};

const slice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    updateSnackbar(state, action) {
      const { message, type } = action.payload;
      state.open = true;
      state.message = message;
      state.type = type;
    },
    closeSnackbar(state) {
      state.open = false;
    },
  },
});

export const { actions: snackbarActions } = slice;

export const useSnackbarSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
