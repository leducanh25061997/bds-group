import { PayloadReadedNotify } from 'app/components/Notification/slice/types';
import { FilterParams, Pageable } from 'types';
import { Notify } from 'types/Notification';
import { serialize } from 'utils/helpers';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const getListNotifications = async (
  params?: FilterParams,
): Promise<Pageable<Notify>> => {
  // const res = await instance.get(`/notification/find-all?${serialize(params)}`);
  const res = await instance.get(`/api/notification?${serialize(params)}`);
  return res.data;
};

const readedNotify = async (params?: PayloadReadedNotify) => {
  const res = await instance.get(`/api/notification/read-one/${params?.id}`);
  return res.data;
};

const readedAllNotify = async (params?: any) => {
  const res = await instance.get(`/api/notification/read-all`);
  return res.data;
};

export default {
  getListNotifications,
  readedNotify,
  readedAllNotify,
};
