import { FilterParams } from 'types';
import { RealEstateItem } from 'types/RealEstate';
import { PropertyType } from 'types/Property';
import { serialize } from 'utils/helpers';
import {
  PayloadCreateRealEstate,
  PayloadGetDetailRealEstate,
  PayloadUpdateStatusRealEstate,
} from 'app/pages/Carrers/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListRealEstates = async (
  params?: FilterParams,
): Promise<RealEstateItem[]> => {
  const res = await instance.get(`/api/project?${serialize(params)}`);
  return res.data;
};

const createRealEstate = async (params?: PayloadCreateRealEstate) => {
  const res = await instance.post(
    `/property/real-estate/create-one-v2`,
    params,
  );
  return res.data;
};

const fetchListViewsType = async (): Promise<PropertyType[]> => {
  const res = await instance.get(`/property/get-real-estate-views`);
  return res.data;
};

const fetchListFactorsType = async (): Promise<PropertyType[]> => {
  const res = await instance.get(`/property/get-real-estate-factors`);
  return res.data;
};

const fetchListRealEstateProject = async (): Promise<PropertyType[]> => {
  const res = await instance.get(`/property/get-real-estate-project`);
  return res.data;
};

const fetchListRealEstateFrontageAdvantage = async (): Promise<
  PropertyType[]
> => {
  const res = await instance.get(
    `/property/real-estate/get-frontage-advantages`,
  );
  return res.data;
};

const getDetailRealEstate = async (
  params: PayloadGetDetailRealEstate,
): Promise<RealEstateItem> => {
  const res = await instance.get(
    `/property/find-real-estate-by-id/${params?.id}`,
  );
  return res.data;
};

const updateStatusRealEstate = async (
  params?: PayloadUpdateStatusRealEstate,
) => {
  const res = await instance.post(`/property/update-status`, params);
  return res.data;
};

const updateRealEstate = async (params?: PayloadCreateRealEstate) => {
  const realEstateId = params?.id;
  delete params?.id;
  const res = await instance.post(
    `/property/real-estate/update-one-v2/${realEstateId}`,
    params,
  );
  return res.data;
};

export default {
  fetchListRealEstates,
  createRealEstate,
  fetchListViewsType,
  fetchListFactorsType,
  fetchListRealEstateProject,
  fetchListRealEstateFrontageAdvantage,
  getDetailRealEstate,
  updateStatusRealEstate,
  updateRealEstate,
};
