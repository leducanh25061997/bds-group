import { FilterParams } from 'types';
import {
  CityStarItem, MembershipItem
} from 'types/CityStar';
import { serialize } from 'utils/helpers';




import { createService } from './axios';
import { PayloadCheckExistCode, PayloadActiveMembership, PayloadGetDetailCityStar, PayloadPostCodeGenerate} from 'app/pages/CityStar/slice/types';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListCityStar = async (
  params?: FilterParams,
): Promise<MembershipItem[]> => {
  const res = await instance.get(`/api/code-generator?${serialize(params)}`);

  return res.data;
};

const fetchListCustomerCityStar = async (
  params?: FilterParams,
): Promise<CityStarItem[]> => {
  const res = await instance.get(`/api/customer-citystar?${serialize(params)}`);

  return res.data;
};


const checkCustomerExist = async (params: PayloadCheckExistCode) => {
  const res = await instance.post(`/api/code-generator/check-code-exists`, params);
  return res.data;
};

const activeMembership = async (params: PayloadActiveMembership) => {
  const res = await instance.post(`/api/customer-citystar`, params);
  return res.data;
};

const postCodeGenerate = async (params: PayloadPostCodeGenerate) => {
  const res = await instance.post(`/api/code-generator`, params);
  return res.data;
};

const getDetailMembership = async (params: PayloadGetDetailCityStar) => {
  const res = await instance.get(`/api/customer-citystar/${params?.id}`);
  return res.data;
};

const getDetailMembershipActive = async (params: PayloadGetDetailCityStar) => {
  const res = await instance.get(`/api/code-generator/${params?.id}`);
  return res.data;
};

export default {
  fetchListCityStar,
  fetchListCustomerCityStar,
  checkCustomerExist,
  activeMembership,
  getDetailMembership,
  getDetailMembershipActive,
  postCodeGenerate
};
