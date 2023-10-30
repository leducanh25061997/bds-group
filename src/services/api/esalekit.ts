import {
  PayloadCreateConsultation,
  PayloadCreateContent,
  PayloadCreateHeadTab,
  PayloadCreateLeftTab,
  PayloadGetEsalekit,
  PayloadUpdateHeadTab,
  PayloadUpdateLeftTab,
} from 'app/pages/Esalekit/slice/types';
import { EsalekitItem, GalleryHeaderItem, LefttabItem } from 'types/Esalekit';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const createLeftTab = async (params?: PayloadCreateLeftTab) => {
  const res = await instance.post(`/api/esalekit/left-tab`, params);
  return res.data;
};

const createGallery = async (params?: PayloadCreateHeadTab) => {
  const res = await instance.post(`/api/esalekit/save-gallery`, params);
  return res.data;
};

const createContent = async (params?: PayloadCreateContent) => {
  const res = await instance.post(`/api/esalekit/content-management`, params);
  return res.data;
};

const createHeadTab = async (params?: PayloadCreateHeadTab) => {
  const res = await instance.post(`/api/esalekit/header-tab`, params);
  return res.data;
};

const getEsalekit = async (
  params: PayloadGetEsalekit,
): Promise<EsalekitItem> => {
  const res = await instance.get(`/api/preview-esalekit/esalekit/${params?.id}`);
  return res.data;
};

const getGalleryHeader = async (
  params: PayloadGetEsalekit,
): Promise<GalleryHeaderItem[]> => {
  const res = await instance.get(
    `/api/preview-esalekit/header-tab-gallery/${params?.id}`,
  );
  return res.data;
};

const getGalleryByType = async (
  params: PayloadGetEsalekit,
): Promise<GalleryHeaderItem[]> => {
  const res = await instance.get(
    `/api/preview-esalekit/content-management?type=${params}`,
  );
  return res.data;
};

const getAllGallery = async (
  params: PayloadGetEsalekit,
): Promise<GalleryHeaderItem[]> => {
  const res = await instance.get(
    `/api/preview-esalekit/esalekit-gallery/${params?.id}`,
  );
  return res.data;
};

const getEsalekitLefttab = async (
  params: PayloadGetEsalekit,
): Promise<LefttabItem> => {
  const res = await instance.get(`/api/preview-esalekit/left-tab/${params?.id}`);
  return res.data;
};

const updateLeftTab = async (params?: PayloadUpdateLeftTab) => {
  const EsalekitId = params?.id;
  delete params?.id;
  const res = await instance.patch(
    `/api/esalekit/left-tab/${EsalekitId}`,
    params,
  );
  return res.data;
};

const deleteLeftTab = async (params?: PayloadGetEsalekit) => {
  const res = await instance.delete(`/api/esalekit/left-tab/${params?.id}`);
  return res.data;
};

const deleteGallery = async (params?: PayloadGetEsalekit) => {
  const res = await instance.delete(`/api/esalekit/gallery/${params?.id}`);
  return res.data;
};

const deleteHeaderTab = async (params?: PayloadGetEsalekit) => {
  const res = await instance.delete(`/api/esalekit/header-tab/${params?.id}`);
  return res.data;
};

const getHeaderTab = async (params?: PayloadGetEsalekit) => {
  const res = await instance.get(`/api/preview-esalekit/header-tab/${params?.id}`);
  return res.data;
};

const createConsultant = async (params?: PayloadCreateConsultation) => {
  const res = await instance.post(`/api/consultation`, params);
  return res.data;
};

const updateHeadTab = async (params?: PayloadUpdateHeadTab) => {
  const EsalekitId = params?.id;
  delete params?.id;
  const res = await instance.patch(
    `/api/esalekit/header-tab/${EsalekitId}`,
    params,
  );
  return res.data;
};

const createGround = async (params?: PayloadCreateHeadTab) => {
  const res = await instance.post(`/api/esalekit/header-tab/ground`, params);
  return res.data;
};

const changeAvatarGallery = async (params?: string) => {
  const res = await instance.patch(`/api/esalekit/avatar/${params}`);
  return res.data;
};

export default {
  createLeftTab,
  createHeadTab,
  createContent,
  createGallery,
  getEsalekit,
  updateLeftTab,
  updateHeadTab,
  deleteLeftTab,
  deleteHeaderTab,
  getEsalekitLefttab,
  getGalleryByType,
  getGalleryHeader,
  deleteGallery,
  createGround,
  getHeaderTab,
  getAllGallery,
  changeAvatarGallery,
  createConsultant
};
