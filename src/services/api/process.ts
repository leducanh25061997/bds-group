import {
  PayloadCreateWorkFlow,
  PayloadGetDetailWorkFlow,
  PayloadUpdateWorkFlow,
  ProcessItem,
  WorkFlowItem,
} from 'app/pages/ProcessManagement/slice/type';
import { FilterParams, Pageable } from 'types';
import { serialize } from 'utils/helpers';
import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListProcess = async (
  params?: FilterParams,
): Promise<Pageable<ProcessItem>> => {
  const res = await instance.get(`/api/work-flow?${serialize(params)}`);
  return res.data;
};

const createWorkFlow = async (params?: PayloadCreateWorkFlow) => {
  const res = await instance.post(`/api/work-flow/create`, params);
  return res.data;
};

const getDetailWorkFlow = async (
  params: PayloadGetDetailWorkFlow,
): Promise<WorkFlowItem> => {
  const res = await instance.get(`/api/work-flow/work-flow-tree/${params.id}`);
  return res.data;
};

const deleteWorkFlow = async (
  params?: PayloadGetDetailWorkFlow,
) => {
  const res = await instance.delete(`/api/work-flow/${params?.id}`);
  return res.data;
};

const updateWorkFlowTree = async (params?: PayloadUpdateWorkFlow) => {
  const ProjectId = params?.id;
  delete params?.id;
  const res = await instance.patch(`/api/work-flow/${ProjectId}`, params);
  return res.data;
};

export default {
  fetchListProcess,
  createWorkFlow,
  getDetailWorkFlow,
  deleteWorkFlow,
  updateWorkFlowTree
};
