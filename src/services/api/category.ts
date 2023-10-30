import { FilterParams, Pageable } from 'types';
import { serialize } from 'utils/helpers';
import {
  CategoryItem,
  PayloadCreateCategory,
  PayloadGetDetailCategory,
} from 'app/pages/Reports/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const getListCategories = async (
  params?: FilterParams,
): Promise<Pageable<CategoryItem>> => {
  const res = await instance.get(`/category?${serialize(params)}`);
  return res.data;
};

const createCategory = async (
  params?: PayloadCreateCategory,
): Promise<CategoryItem> => {
  const res = await instance.post(`/category`, params);
  return res.data;
};

const editCategory = async (params?: CategoryItem): Promise<CategoryItem> => {
  const categoryId = params?.id;
  delete params?.id;
  const res = await instance.post(`/category/edit/${categoryId}`, params);
  return res.data;
};

const getDetailCategory = async (
  params?: PayloadGetDetailCategory,
): Promise<CategoryItem> => {
  const res = await instance.get(`/category/show/${params?.id}`);
  return res.data;
};

const updateStatusCategory = async (
  params?: PayloadGetDetailCategory,
): Promise<CategoryItem> => {
  const res = await instance.post(`/category/change-status/${params?.id}`);
  return res.data;
};

export default {
  getListCategories,
  createCategory,
  getDetailCategory,
  editCategory,
  updateStatusCategory,
};
