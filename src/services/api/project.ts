import { FilterParams, Pageable } from 'types';
import { ProjectItem, SignProductParams } from 'types/Project';
import { serialize } from 'utils/helpers';

import {
  PayloadCreateProject,
  PayloadGetDetailProject,
  PayloadGetWorkFlowTree,
  PayloadUpdateProject,
} from 'app/pages/Projects/slice/types';

import { Sector } from 'types/RealEstate';

import {
  CreateInformationProjectFormData,
  InformationProjectResponse,
} from 'app/pages/ManagementInformation/slice/types';
import {
  ApartmentInformationSParams,
  ChangeOrgChartProductRequest,
  TableProductInformation,
  UpdateStatusProductCustomerParams,
  UpdateStatusTableProductParams,
} from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';

import {
  UpdateNoteParams,
  MoveProductToSaleProgramParams,
} from '../../app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListProject = async (
  params?: FilterParams,
): Promise<ProjectItem[]> => {
  const res = await instance.get(`/api/project?${serialize(params)}`);
  return res.data;
};

const createProject = async (params?: PayloadCreateProject) => {
  const res = await instance.post(`/api/project`, params);
  return res.data;
};

const fetchListSectorsType = async (): Promise<Sector[]> => {
  const res = await instance.get(`/other-property/get-all-sector`);
  return res.data;
};

const getDetailProject = async (
  params: PayloadGetDetailProject,
): Promise<ProjectItem> => {
  const res = await instance.get(`/api/project/${params.id}`);
  return res.data;
};

const updateProject = async (params?: PayloadUpdateProject) => {
  const ProjectId = params?.id;
  delete params?.id;
  const res = await instance.patch(`/api/project/${ProjectId}`, params);
  return res.data;
};

const createProjectSettings = async (
  params: CreateInformationProjectFormData,
) => {
  const res = await instance.post(
    `/api/project-setting/${params.projectId}`,
    params,
  );
  return res.data;
};

const fetchWorkFlow = async (params?: FilterParams): Promise<Pageable<any>> => {
  const res = await instance.get(`/api/work-flow?${serialize(params)}`);
  return res.data;
};

const fetchInformationProject = async (
  projectId?: string,
): Promise<InformationProjectResponse> => {
  const params = {
    projectId,
  };
  const res = await instance.get(
    `/api/project-setting/${projectId}?${serialize(params)}`,
  );
  return res.data;
};

const fetchDatatable = async (
  params: ApartmentInformationSParams,
): Promise<any> => {
  const res = await instance.get(
    `/api/product/data-table?${serialize(params)}`,
  );
  return res.data;
};

const fetchSettingTableProduct = async (
  params: ApartmentInformationSParams,
): Promise<any> => {
  const res = await instance.get(
    `/api/setting-table-product/${params.idProject}`,
  );
  return res.data;
};

const fetchTableProductInformation = async (
  params: string,
): Promise<TableProductInformation> => {
  const res = await instance.get(`/api/product/info/${params}`);
  return res.data;
};

const updateStatusTableProduct = async (
  params: UpdateStatusTableProductParams,
): Promise<any> => {
  const res = await instance.patch(`/api/product/update-status`, params);
  return res.data;
};

const lockTableRroduct = async (
  params: UpdateStatusTableProductParams,
): Promise<any> => {
  const _params: any = { ...params };
  delete _params.id;
  const res = await instance.patch(`/api/product/lock`, _params);
  return res.data;
};

const unLockTableRroduct = async (
  params: UpdateStatusTableProductParams,
): Promise<any> => {
  const _params: any = { ...params };
  delete _params.id;
  const res = await instance.patch(`/api/product/unlock`, _params);
  return res.data;
};

const changeOrgChartProduct = async (params: ChangeOrgChartProductRequest) => {
  const res = await instance.patch(`/api/product/change-org-chart`, params);
  return res.data;
};

const updateNote = async (params: UpdateNoteParams) => {
  const _params: any = { ...params };
  delete _params.id;
  const res = await instance.patch(
    `/api/product/update-note/${params.id}`,
    _params,
  );
  return res.data;
};

const moveProductToSaleProgram = async (
  params: MoveProductToSaleProgramParams,
) => {
  const res = await instance.patch(
    `/api/setting-sales-program/move-to-program/product`,
    params,
  );
  return res.data;
};

const creteProductCustomer = async (params: any): Promise<any> => {
  const res = await instance.post(`/product-customer/sign`, params);
  return res.data;
};

const updateStatusProductCustomer = async (
  params: UpdateStatusProductCustomerParams,
): Promise<any> => {
  const _params: any = { ...params };
  delete _params.id;
  const res = await instance.post(
    `/product-customer/update-status/${params.id}`,
    _params,
  );
  return res.data;
};

const removeProductToSaleProgram = async (
  params: MoveProductToSaleProgramParams,
) => {
  const res = await instance.patch(
    `/api/setting-sales-program/remove-from-program/product`,
    params,
  );
  return res.data;
};

const SignProduct = async (params: SignProductParams) => {
  const res = await instance.post(`/sign-product`, params);
  return res.data;
};

const returnProduct = async (params: SignProductParams) => {
  const res = await instance.post(`/sign-product/return`, params);
  return res.data;
};

const fetchWorkFlowTree = async (payload: PayloadGetWorkFlowTree) => {
  const { id, ...rest } = payload;
  const res = await instance.get(
    `/api/project-setting/workflow-tree/${id}?${serialize(rest)}`,
  );

  return res.data;
};

export default {
  fetchListProject,
  createProject,
  fetchListSectorsType,
  getDetailProject,
  updateProject,
  createProjectSettings,
  fetchWorkFlow,
  fetchInformationProject,
  fetchDatatable,
  fetchSettingTableProduct,
  fetchTableProductInformation,
  updateStatusTableProduct,
  lockTableRroduct,
  unLockTableRroduct,
  changeOrgChartProduct,
  updateNote,
  moveProductToSaleProgram,
  creteProductCustomer,
  updateStatusProductCustomer,
  removeProductToSaleProgram,
  SignProduct,
  returnProduct,
  fetchWorkFlowTree,
};
