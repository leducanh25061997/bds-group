import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { Notify } from 'types/Notification';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { notifySaga } from './saga';

import { NotifyState } from './types';

export const initialState: NotifyState = {};

const slice = createSlice({
  name: 'noticationSlice',
  initialState,
  reducers: {
    getListNotifications(state, action) {
      state.isLoading = true;
    },
    getListNotificationsSuccess: (
      state,
      action: PayloadAction<Pageable<Notify>>,
    ) => {
      state.notificationsList = action.payload;
      state.isLoading = false;
    },
    readedNotify(state, action) {},
    readedAllNotify(state, action) {},
    readedAllNotifySuccess(state) {
      state.hasUnread = false;
      state.totalUnread = 0;
    },
    checkHasUnreadNotify(state, action) {},
    checkHasUnreadNotifySuccess: (
      state,
      action: PayloadAction<Pageable<Notify>>,
    ) => {
      if (action.payload?.data?.length) {
        state.hasUnread = true;
        state.notificationsList = action.payload;
        state.totalUnread = action.payload?.total;
      } else {
        state.hasUnread = false;
        state.totalUnread = 0;
      }
    },
  },
});

export const useNotificationsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: notifySaga });
  return { actions: slice.actions };
};

export const { actions: notifyActions } = slice;
