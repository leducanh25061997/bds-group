import { FilterParams } from 'types';
import { serialize } from 'utils/helpers';

import { createService } from './axios';
import {
  FileImport,
  LeadItem,
  PayloadLeadAllotment,
  PayloadUpdateLead,
  PayloadUpdateLeadSegment,
  Segment,
} from 'app/pages/Leads/slice/types';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListLead = async (params?: FilterParams): Promise<LeadItem[]> => {
  const res = await instance.get(
    `/api/lead?${serialize(params)}&isCreen=false`,
  );
  return res.data;
};

const fetchListLeadAllotment = async (
  params?: FilterParams,
): Promise<LeadItem[]> => {
  const res = await instance.get(`/api/lead?${serialize(params)}&isCreen=true`);
  return res.data;
};

const fetchListLeadAlloted = async (
  params?: FilterParams,
): Promise<LeadItem[]> => {
  const res = await instance.get(`/api/lead?${serialize(params)}&isCreen=true&isAllotted=true`);
  return res.data;
};

const getSegment = async (): Promise<Segment[]> => {
  const res = await instance.get(`/api/lead/segment`);
  return res.data?.data ?? [];
};

const getFileImport = async (): Promise<FileImport[]> => {
  const res = await instance.get(`/api/lead/file-import`);
  return res.data?.data ?? [];
};

const updateLeadSegment = async (params?: PayloadUpdateLeadSegment) => {
  const res = await instance.patch(`/api/lead/screen`, params);
  return res.data;
};

const updateLeads = async (params?: PayloadUpdateLead) => {
  const requestId = params?.id
  const res = await instance.patch(`/api/lead/${requestId}`, params);
  return res.data;
};

const updateLeadAllotment = async (params?: PayloadLeadAllotment) => {
  const res = await instance.post(`/api/lead/allotment`, params);
  return res.data;
};

const updateStatus = async (params?: any) => {
  const id = params?.id;
  delete params?.id;
  const res = await instance.patch(`/api/lead/change-status/${id}`, params);
  return res.data;
};

const createSegment = async (params?: { type: string }) => {
  const res = await instance.post(`/api/lead/create-segment`, params);
  return res.data?.data ?? [];
};

const fetchListLeadTakeCare = async (params?: FilterParams): Promise<LeadItem[]> => {
  const res = await instance.get(`/api/lead/get-leads?${serialize(params)}`);
  return res.data;
};

export default {
  fetchListLead,
  getSegment,
  createSegment,
  fetchListLeadTakeCare,
  getFileImport,
  fetchListLeadAllotment,
  fetchListLeadAlloted,
  updateLeadSegment,
  updateLeadAllotment,
  updateStatus,
  updateLeads,
};
