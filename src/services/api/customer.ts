import { FilterParams } from 'types';
import { CustomerItem } from 'types/User';
import { serialize } from 'utils/helpers';

import { PayloadGetDetailComisstion } from '../../app/pages/Comisstion/slice/types';

import {
  PayloadUpdateStatusCustomer,
  PayloadCreateCustomer,
  PayloadUpdateCustomer,
  PayloadGetDetailCustomer,
  PayloadCreateActivity,
  PayloadAppraisalCustomer,
  PayloadApproveAction,
  PayloadSendApproveCustomer,
  PayloadSentApprove,
} from '../../app/pages/CustomerPotential/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListCustomer = async (
  params?: FilterParams,
): Promise<CustomerItem[]> => {
  const res = await instance.get(`/api/customer?${serialize(params)}`);
  return res.data;
};

const fetchListCustomerTrans = async (
  params?: FilterParams,
): Promise<CustomerItem[]> => {
  const res = await instance.get(
    `/api/customer?${serialize(params)}&isTransaction=true`,
  );
  return res.data;
};

const fetchListCustomerInTicket = async (
  params?: FilterParams,
): Promise<CustomerItem[]> => {
  const res = await instance.get(
    `/api/customer/support-create-ticket?${serialize(params)}`,
  );
  return res.data;
};

const updateStatusCustomer = async (params?: PayloadUpdateStatusCustomer) => {
  const res = await instance.post(`/api/user/update-status`, params);
  return res.data;
};

const createCustomer = async (params?: PayloadCreateCustomer) => {
  const res = await instance.post(`/api/customer`, params);
  return res.data;
};

const getDetailCustomer = async (
  params: PayloadGetDetailCustomer,
): Promise<CustomerItem> => {
  const res = await instance.get(`/api/customer/${params?.id}`);
  return res.data;
};

const updateDataCustomer = async (params?: PayloadUpdateCustomer) => {
  const res = await instance.patch(`/api/customer/${params?.id}`, params);
  return res.data;
};

const sendApproveCustomer = async (params?: PayloadSentApprove) => {
  const res = await instance.get(`/api/customer-big-approve/${params?.approveId}?customerId=${params?.customerId}`);
  return res.data;
};

const updateApproveCustomer = async (params?: PayloadApproveAction) => {
  const res = await instance.post(`/api/customer-big-approve/approve-customer`, params);
  return res.data;
};

const createActivityCustomer = async (params?: PayloadCreateActivity) => {
  const res = await instance.post(`/api/customer/activity`, params);
  return res.data;
};

const logImportCustomer = async (params?: FilterParams) => {
  const res = await instance.get(`/api/log-import?${serialize(params)}`);
  return res.data;
};

const appraisalCustomer = async (params: PayloadAppraisalCustomer) => {
  const { id, ...body } = params;
  const res = await instance.patch(`/api/customer/appraisal/${id}`, body);
  return res.data;
};

export default {
  fetchListCustomer,
  fetchListCustomerTrans,
  updateStatusCustomer,
  getDetailCustomer,
  createCustomer,
  updateDataCustomer,
  sendApproveCustomer,
  updateApproveCustomer,
  createActivityCustomer,
  fetchListCustomerInTicket,
  logImportCustomer,
  appraisalCustomer,
};
