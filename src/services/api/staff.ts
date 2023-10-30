import {
  PayloadCreateStaff,
  PayloadGetDetailStaff,
  PayloadGetListStaffInProject,
  PayloadUpdateStaff,
} from 'app/pages/Staff/slice/types';
import { FilterParams, Pageable } from 'types';
import { serialize } from 'utils/helpers';

import { StaffItem } from 'types/Staff';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListStaff = async (
  params?: FilterParams,
): Promise<Pageable<StaffItem>> => {
  const res = await instance.get(`/api/staff?${serialize(params)}`);
  return res.data;
};

const getListStaffInProject = async (
  params?: PayloadGetListStaffInProject,
): Promise<Pageable<StaffItem>> => {
  const res = await instance.post(`/api/staff/sale-staff`, params);
  return res.data;
};

const createStaff = async (params?: PayloadCreateStaff) => {
  const res = await instance.post(`/api/staff/create-one`, params);

  return JSON.stringify(res.data);
};

const getDetailStaff = async (
  params: PayloadGetDetailStaff,
): Promise<StaffItem> => {
  const res = await instance.get(`/api/staff/${params?.id}`);

  return res.data;
};

const updateDataStaff = async (params?: PayloadUpdateStaff) => {
  const staffId = params?.id;
  delete params?.id;
  const res = await instance.patch(`/api/staff/${staffId}`, params);
  return res.data;
};

export default {
  fetchListStaff,
  createStaff,
  getDetailStaff,
  updateDataStaff,
  getListStaffInProject,
};
