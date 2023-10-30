import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PropertyType } from 'types/Property';

import { PermisstionItem, RoleItem, User } from 'types/Contract';

import {
  SettingState,
  PayloadCreatePermission,
  PayloadUpdateRoles,
  PayloadUpdateUserRoles,
  PayloadGetDetailRoles,
} from './types';

import { contractSaga } from './saga';

export const initialState: SettingState = {};

const slice = createSlice({
  name: 'settingSlice',
  initialState,
  reducers: {
    fetchListPermission(state, action) {
      state.isLoading = true;
    },
    fetchListPermissionSuccess: (
      state,
      action: PayloadAction<Pageable<PermisstionItem>>,
    ) => {
      state.permissionManager = action.payload;
      state.isLoading = false;
    },
    fetchListUser(state, action) {
      state.isLoading = true;
    },
    fetchListUserSuccess: (state, action: PayloadAction<Pageable<User>>) => {
      state.userManager = action.payload;
      state.isLoading = false;
    },
    fetchListRole(state, action) {},
    fetchListRoleSuccess: (
      state,
      action: PayloadAction<Pageable<RoleItem>>,
    ) => {
      state.rolesManager = action.payload;
    },
    createRoles: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreatePermission, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createRolesSuccess: () => {},
    getRoleDetail(state, action) {
      state.isLoading = true;
    },
    getRoleDetailSuccess: (state, action) => {
      state.isLoading = false;
      state.roleDetail = action.payload;
    },
    updateDataRoles: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateRoles, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataRolesSuccess: () => {},
    updateDataUserRoles: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateUserRoles, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataUserRolesSuccess: () => {},
    deleteUserRoles: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadGetDetailRoles, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    deleteUserRolesSuccess: () => {},
    clearDataContract(state) {
      state.contractDetail = null;
    },
    fetchListPropertyType() {},
    fetchListPropertyTypeSuccess: (
      state,
      action: PayloadAction<PropertyType[]>,
    ) => {
      const listPropertyCover: PropertyType[] = [];
      action.payload.forEach(item => {
        listPropertyCover.push({
          value: item.id + '',
          key: item.name,
          id: item.id,
          description: item.name,
          name: item.name,
        });
      });
      state.listPropertyType = listPropertyCover;
    },
  },
});

export const useSettingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: contractSaga });
  return { actions: slice.actions };
};

export const { actions: contractActions } = slice;
