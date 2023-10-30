import { OrgchartItem } from 'types/Orgchart';

import {
  PayloadCreateOrgchart,
  PayloadGetDetailOrgchart,
  PayloadGetStaffOrgchart,
  PayloadUpdateOrgchart,
} from 'app/pages/Orgchart/slice/types';

import { StaffItem } from 'types/Staff';

import { FilterParams } from 'types';
import { serialize } from 'utils/helpers';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListOrgchart = async (): Promise<OrgchartItem[]> => {
  const res = await instance.get(`/api/org-chart`);
  return res.data;
};

const fetchListStaffOrgchart = async (
  params?: FilterParams,
): Promise<StaffItem[]> => {
  const res = await instance.get(`/api/staff/staff-of-org?${serialize(params)}`);
  return res.data;
};

const fetchListOrgchartFilter = async (
  params?: FilterParams,
): Promise<OrgchartItem[]> => {
  const res = await instance.get(`/api/org-chart?${serialize(params)}`);
  return res.data;
};

const createOrgchart = async (params?: PayloadCreateOrgchart) => {
  const res = await instance.post(`/api/org-chart`, params);
  return res.data;
};

const getDetailOrgchart = async (
  params: PayloadGetDetailOrgchart,
): Promise<OrgchartItem> => {
  const res = await instance.get(`/api/org-chart/${params.id}`);
  return res.data;
};

const getStaffNoneOrgchart = async (): Promise<StaffItem> => {
  const res = await instance.get(`/api/staff/none-org`);
  return res.data;
};

const updateOrgchart = async (params?: PayloadUpdateOrgchart) => {
  const OrgchartId = params?.id;
  delete params?.id;
  const res = await instance.patch(`/api/org-chart/${OrgchartId}`, params);
  return res.data;
};

const fetchListOrgchartProduct = async (
  id: string,
): Promise<OrgchartItem[]> => {
  const params: any = {
    projectId: id,
  };
  const res = await instance.get(
    `/api/org-chart/filter-org?${serialize(params)}`,
  );
  return res.data;
};

export default {
  fetchListOrgchart,
  fetchListStaffOrgchart,
  fetchListOrgchartFilter,
  createOrgchart,
  getDetailOrgchart,
  updateOrgchart,
  getStaffNoneOrgchart,
  fetchListOrgchartProduct,
};
