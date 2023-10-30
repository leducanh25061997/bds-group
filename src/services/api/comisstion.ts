import { FilterParams } from 'types';
import {
  UPloadComisstion,
  UPloadComisstionDetail
} from 'types/User';
import { serialize } from 'utils/helpers';

import { ComissionPolicyDetail, ComisstionPolicy } from 'types/Comisstion';

import {
  PayloadCreateComisstionPolicy,
  PayloadGetDetailComisstionPolicy,
} from 'app/pages/ComisstionPolicy/slice/types';

import {
  PayloadCreateComisstion,
  PayloadGetDetailComisstion,
  PayloadManagerment,
  PayloadUpdateComisstion,
  RoleData
} from '../../app/pages/Comisstion/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListComisstion = async (
  params?: FilterParams,
): Promise<UPloadComisstion[]> => {
  const res = await instance.get(`/api/commission?${serialize(params)}`);

  return res.data;
};

const fetchListComisstionPolicy = async (
  params?: FilterParams,
): Promise<ComisstionPolicy[]> => {
  const res = await instance.get(
    `/api/commissionpolicy?checkStatus=true&${serialize(params)}`,
  );

  return res.data;
};

const fetchListComisstionPolicyInactive = async (
  params?: FilterParams,
): Promise<ComisstionPolicy[]> => {
  const res = await instance.get(
    `/api/commissionpolicy?checkStatus=false&${serialize(params)}`,
  );

  return res.data;
};

const fetchListManagement = async (params: PayloadManagerment) => {
  if (params.id !== undefined) {
    const res = await instance.get(
      `/api/commissionpolicy/all-manager?orgChartId=${params?.id}`,
    );
    return res.data;
  }
};

const updateStatusComisstion = async (params?: any) => {
  const res = await instance.post(`/api/commissiondetail/sendsms`, params);
  return res.data;
};

const getDetailComisstion = async (
  params: PayloadGetDetailComisstion,
): Promise<UPloadComisstionDetail> => {
  const res = await instance.get(
    `/api/commissiondetail?limit=1000&page=1&commissionId=${params?.id}`,
  );
  return res.data;
};

const createComisstion = async (params?: PayloadCreateComisstion) => {
  const res = await instance.post(`/staff/create-one`, params);
  return res.data;
};

const createComisstionPolicy = async (
  params?: PayloadCreateComisstionPolicy,
) => {
  const res = await instance.post(`/api/commissionpolicy`, params);
  return res.data;
};

const getDetailComisstionPolicy = async (
  params: PayloadGetDetailComisstionPolicy,
): Promise<ComissionPolicyDetail> => {
  const res = await instance.get(`/api/commissionpolicy/${params?.id}`);
  return res.data;
};

const fetchRoleList = async (): Promise<RoleData[]> => {
  const res = await instance.get(`/role/find-all`);
  return res.data;
};

const updateDataComisstion = async (params?: PayloadUpdateComisstion) => {
  const userId = params?.id;
  delete params?.id;
  const res = await instance.post(`/staff/update-one/${userId}`, params);
  return res.data;
};


export default {
  fetchListComisstion,
  fetchListComisstionPolicy,
  fetchListComisstionPolicyInactive,
  updateStatusComisstion,
  getDetailComisstion,
  createComisstion,
  createComisstionPolicy,
  getDetailComisstionPolicy,
  fetchRoleList,
  updateDataComisstion,
  fetchListManagement,
};
