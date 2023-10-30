import { FilterParams } from 'types';
import {
  PermisstionItem,
  RoleDetailItem,
  RoleItem,
  User,
} from 'types/Contract';
import { PropertyType } from 'types/Property';
import { serialize } from 'utils/helpers';

import {
  PayloadCreatePermission,
  PayloadGetDetailRoles,
  PayloadUpdateRoles,
  PayloadUpdateUserRoles,
} from 'app/pages/Settings/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListPermission = async (
  params?: FilterParams,
): Promise<PermisstionItem[]> => {
  const res = await instance.get(`/api/permissiongroup?${serialize(params)}`);
  return res.data;
};

const fetchListUsers = async (params?: FilterParams): Promise<User[]> => {
  const res = await instance.get(`/user`);
  return res.data;
};

const fetchListContractCustomer = async (
  params?: FilterParams,
): Promise<PermisstionItem[]> => {
  const res = await instance.get(`/contract/find-all-v2?${serialize(params)}`);
  return res.data;
};

const approveContractCustomer = async (
  id: string,
): Promise<PermisstionItem> => {
  const res = await instance.post(`/contract/approve-contract/${id}`);
  return res.data;
};

const refuseContractCustomer = async (params: string) => {
  const res = await instance.post(`/contract/refuse-contract/${params}`);
  return res.data;
};

const fetchListRoles = async (params?: FilterParams): Promise<RoleItem[]> => {
  const res = await instance.get(`/api/role?${serialize(params)}`);
  return res.data;
};

const fetchListRolesDetail = async (
  params?: PayloadGetDetailRoles,
): Promise<RoleDetailItem> => {
  const res = await instance.get(`/api/role/${params?.id}`);
  return res.data;
};

const createPermission = async (params?: PayloadCreatePermission) => {
  const res = await instance.post(`/api/role`, params);
  return res.data;
};

const updateDataRoles = async (params?: PayloadUpdateRoles) => {
  const rolestId = params?.id;
  delete params?.id;
  const res = await instance.patch(`/api/role/${rolestId}`, params);
  return res.data;
};

const updateDataUserRoles = async (params?: PayloadUpdateUserRoles) => {
  const res = await instance.post(`/user/addToRole`, params);
  return res.data;
};

const deleteDataUserRoles = async (params?: PayloadGetDetailRoles) => {
  const res = await instance.delete(`/api/role/${params?.id}`);
  return res.data;
};

const getDetailContract = async (params: any): Promise<PermisstionItem> => {
  const res = await instance.get(`/contract/find-one/${params?.id}`);
  return res.data;
};

const fetchListPropertyType = async (): Promise<PropertyType[]> => {
  const res = await instance.get(`/property/get-real-estate-sectors`);
  return res.data;
};

const createPropertyInContract = async (params?: any) => {
  const res = await instance.post(`/property/create-contract-property`, params);
  return res.data;
};

const updateStatusContract = async (params?: any) => {
  const res = await instance.post(
    `/contract/update-status/${params?.id}`,
    params,
  );
  return res.data;
};

const sendContractForCustomer = async (params?: any) => {
  delete params?.status;
  const res = await instance.post(
    `/contract/send-contract/${params?.id}`,
    params,
  );
  return res.data;
};

const cancelContract = async (params?: any) => {
  delete params?.status;
  const res = await instance.post(
    `/contract/cancel-contract/${params?.id}`,
    params,
  );
  return res.data;
};

const replyComment = async (params?: any) => {
  const contractId = params?.id;
  delete params?.id;
  const res = await instance.post(
    `/contract/rep-comment/${contractId}`,
    params,
  );
  return res.data;
};

const deleteContract = async (params?: any) => {
  delete params?.status;
  const res = await instance.post(
    `/contract/delete-contract/${params?.id}`,
    params,
  );
  return res.data;
};

const uploadContractAttachment = async (params?: any) => {
  const contractId = params?.id;
  delete params?.id;
  const res = await instance.post(
    `/contract/upload-attachedContract/${contractId}`,
    params,
  );
  return res.data;
};

const commentContract = async (params?: any) => {
  const contractId = params?.id;
  delete params?.id;
  const res = await instance.post(`/contract/comment/${contractId}`, params);
  return res.data;
};

const previewContract = async (params?: any): Promise<any> => {
  delete params?.id;
  const res = await instance.post(`/contract/review-contract`, params);
  return res.data;
};

const liquidateContract = async (params?: any): Promise<any> => {
  const contractId = params?.id;
  delete params?.id;
  const res = await instance.post(
    `/contract/liquidate-contract/${contractId}`,
    params,
  );
  return res.data;
};

const previewContractLiquidate = async (params: any): Promise<any> => {
  const { id, ...payload } = params;
  const res = await instance.post(
    `/contract/review-liquidate-contract/${id}`,
    payload,
  );
  return res.data;
};

const approveLiquidateContract = async (
  id: string,
): Promise<PermisstionItem> => {
  const res = await instance.post(`/contract/approve-liquidate-contract/${id}`);
  return res.data;
};

const refuseLiquidateContract = async (params: string) => {
  const res = await instance.post(
    `/contract/refuse-liquidate-contract/${params}`,
  );
  return res.data;
};

const checkDuplicatePropertyCode = async (params: any) => {
  const res = await instance.post(`/property/check-contract-property`, params);
  return res.data;
};

export default {
  fetchListPermission,
  fetchListUsers,
  fetchListContractCustomer,
  approveContractCustomer,
  refuseContractCustomer,
  fetchListRoles,
  fetchListRolesDetail,
  createPermission,
  getDetailContract,
  fetchListPropertyType,
  createPropertyInContract,
  updateStatusContract,
  sendContractForCustomer,
  cancelContract,
  updateDataRoles,
  replyComment,
  deleteContract,
  uploadContractAttachment,
  updateDataUserRoles,
  deleteDataUserRoles,
  commentContract,
  previewContract,
  liquidateContract,
  previewContractLiquidate,
  approveLiquidateContract,
  refuseLiquidateContract,
  checkDuplicatePropertyCode,
};
