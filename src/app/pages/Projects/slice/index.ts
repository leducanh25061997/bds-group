import { PayloadAction } from '@reduxjs/toolkit';
import { Pageable } from 'types';
import { ProjectItem } from 'types/Project';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { ProjectSaga } from './saga';

import {
  ProjectState,
  PayloadCreateProject,
  PayloadUpdateProject,
} from './types';

export const initialState: ProjectState = {};

const slice = createSlice({
  name: 'ProjectSlice',
  initialState,
  reducers: {
    fetchListProject(state, action) {
      state.isLoading = true;
    },
    fetchListProjectSuccess: (
      state,
      action: PayloadAction<Pageable<ProjectItem>>,
    ) => {
      state.ProjectManagement = action.payload;
      state.isLoading = false;
    },

    createProject: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadCreateProject, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createProjectSuccess(state) {
      state.isLoading = false
    },
    getDetailProject(state, action) {
      state.isLoading = true;
    },
    getDetailProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.ProjectDetail = action.payload;
    },
    updateDataProject: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadUpdateProject, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateDataProjectSuccess: () => {},
    clearDataProject(state) {
      state.ProjectDetail = null;
      state.ListStaffInProject = { data: [], total: 0 };
    },
    getListStaffInProject(state, action) {
      state.isLoading = true;
    },
    getListStaffInProjectSuccess: (state, action) => {
      state.isLoading = false;
      state.ListStaffInProject = action.payload;
    },
  },
});

export const useProjectSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: ProjectSaga });
  return { actions: slice.actions };
};

export const { actions: customerActions } = slice;
