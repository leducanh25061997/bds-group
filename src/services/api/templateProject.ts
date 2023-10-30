import { FilterParams, Pageable } from 'types';

import {
  PayloadCreateFileDocument,
  PayloadDeleteTemplateDocumentPrint,
  PayloadGetDocumentPrintDetail,
  PayloadUpdateFileDocument,
  fileDocumentitem,
  PayloadCreateTemplateEmailAndSms,
  ProviderSMS,
} from 'app/pages/TemplateProject/slice/types';
import { serialize } from 'utils/helpers';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListTemplateDocument = async (
  params?: FilterParams,
): Promise<fileDocumentitem[]> => {
  const res = await instance.get(`/api/print?${serialize(params)}`);
  return res.data;
};
const createTemplateDocument = async (
  params?: PayloadCreateFileDocument,
): Promise<fileDocumentitem> => {
  const res = await instance.post(`/api/print`, params);
  return res.data;
};
const getDetailDocumentPrint = async (
  params?: PayloadGetDocumentPrintDetail,
): Promise<fileDocumentitem> => {
  const res = await instance.get(`/api/print/${params?.id}`);
  return res.data;
};
const updateTemplateDocumentPrint = async (
  params?: PayloadUpdateFileDocument,
) => {
  const res = await instance.patch(`/api/print/${params?.id}`, params?.payload);
  return res.data;
};
const deleteTemplateDocumentPrint = async (
  params?: PayloadDeleteTemplateDocumentPrint,
) => {
  const res = await instance.delete(`/api/print/${params?.id}`);
  return res.data;
};

const fetchListTemplateEmailAndSms = async (
  params?: FilterParams,
): Promise<fileDocumentitem[]> => {
  const res = await instance.get(`/api/template?${serialize(params)}`);
  return res.data;
};

const createTemplateEmailAndSms = async (
  params?: PayloadCreateTemplateEmailAndSms,
): Promise<PayloadCreateTemplateEmailAndSms> => {
  const res = await instance.post(`/api/template`, params);
  return res.data;
};
const getDetailTemplateEmailAndSms = async (
  params?: PayloadCreateTemplateEmailAndSms,
): Promise<PayloadCreateTemplateEmailAndSms> => {
  const res = await instance.get(`/api/template/${params?.id}`);
  return res.data;
};
const updateTemplateEmailAndSms = async (
  params?: PayloadCreateTemplateEmailAndSms,
) => {
  const data = { ...params };
  delete data.id;
  const res = await instance.patch(`/api/template/${params?.id}`, data);
  return res.data;
};
const deleteTemplateEmailAndSms = async (
  params?: PayloadCreateTemplateEmailAndSms,
) => {
  const res = await instance.delete(`/api/template/${params?.id}`);
  return res.data;
};

const getListBranchProvider = async (
  params?: FilterParams,
): Promise<Pageable<ProviderSMS>> => {
  const res = await instance.get(`/api/sms-branchname?${serialize(params)}`);
  return res.data;
};

export default {
  fetchListTemplateDocument,
  createTemplateDocument,
  getDetailDocumentPrint,
  deleteTemplateDocumentPrint,
  updateTemplateDocumentPrint,
  fetchListTemplateEmailAndSms,
  createTemplateEmailAndSms,
  getDetailTemplateEmailAndSms,
  updateTemplateEmailAndSms,
  deleteTemplateEmailAndSms,
  getListBranchProvider,
};
