import { FilterParams } from 'types';
import { serialize } from 'utils/helpers';

import {
  FilterProduct,
  PayloadActionPriceSalesProgram,
  PayloadGetDetailSalesProgram,
  PayloadGetOrgtChart,
  PayloadSalesProgram,
  PayloadSendNoti,
  PayloadUpdateSalesProgram,
  PayloadUpdateStatusSalesProgram,
  SalesProgramItem,
} from 'app/pages/SalesProgram/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListSalesProgram = async (
  params?: FilterParams,
): Promise<SalesProgramItem[]> => {
  const res = await instance.get(
    `/api/setting-sales-program?${serialize(params)}`,
  );
  return res.data;
};

const fetchListProduct = async (
  params?: FilterProduct,
): Promise<SalesProgramItem[]> => {
  const res = await instance.get(
    `/api/setting-sales-program/products/all?${serialize(params)}`,
  );
  return res.data;
};

const createSalesProgram = async (params?: PayloadSalesProgram) => {
  const res = await instance.post(`/api/setting-sales-program`, params);

  return JSON.stringify(res.data);
};

const updateStatusSalesProgram = async (
  params?: PayloadUpdateStatusSalesProgram,
) => {
  const salesProgramId = params?.id;
  delete params?.id;
  const res = await instance.patch(
    `/api/setting-sales-program/${salesProgramId}`,
    params,
  );
  return res.data;
};

const actionPriceSalesProgram = async (
  params?: PayloadActionPriceSalesProgram,
) => {
  const salesProgramId = params?.id;
  delete params?.id;
  const res = await instance.patch(
    `/api/setting-sales-program/${salesProgramId}`,
    params,
  );
  return res.data;
};

const getDetailSalesProgram = async (
  params: PayloadGetDetailSalesProgram,
): Promise<SalesProgramItem> => {
  const res = await instance.get(`/api/setting-sales-program/${params.id}`);
  return res.data;
};

const updateDataSalesProgram = async (params?: PayloadUpdateSalesProgram) => {
  const salesProgramId = params?.id;
  delete params?.id;
  const res = await instance.put(
    `/api/setting-sales-program/${salesProgramId}`,
    params,
  );
  return res.data;
};

const deleteSalesProgram = async (params?: PayloadGetDetailSalesProgram) => {
  const res = await instance.delete(`/api/setting-sales-program/${params?.id}`);
  return res.data;
};

const sendNoti = async (params: PayloadSendNoti) => {
  const res = await instance.post(
    `/api/setting-sales-program/send-noti`,
    params,
  );

  return res.data;
};

const getOrgChart = async (params: PayloadGetOrgtChart) => {
  const res = await instance.get(
    `/api/setting-sales-program/get-org-chart/${params.id}`,
  );

  return res.data;
};

export default {
  fetchListSalesProgram,
  createSalesProgram,
  updateStatusSalesProgram,
  actionPriceSalesProgram,
  getDetailSalesProgram,
  fetchListProduct,
  updateDataSalesProgram,
  deleteSalesProgram,
  sendNoti,
  getOrgChart,
};
