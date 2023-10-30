import { FilterParams, Pageable } from 'types';
import { serialize } from 'utils/helpers';
import {
  MissionAssignedItem,
  PayloadCreateKpiMission,
  PayloadGetDetailKpiMission,
  PayloadGetStatisticKpi,
  PayloadUpdateKpiMission,
  StatisticKpiItem,
} from 'app/pages/KPIMission/slice/types';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListMissionAssigned = async (
  params?: FilterParams,
): Promise<Pageable<MissionAssignedItem>> => {
  const res = await instance.get(`/api/kpi?${serialize(params)}`);

  return res.data;
};

const createKpiMission = async (
  params?: PayloadCreateKpiMission,
): Promise<MissionAssignedItem> => {
  const res = await instance.post(`/api/kpi`, params);
  return res.data;
};

const getDetailKpiMission = async (params?: PayloadGetDetailKpiMission) => {
  const res = await instance.get(`/api/kpi/${params?.id}`);
  return res.data;
};

const getHandleKpiMission = async (params?: PayloadGetDetailKpiMission) => {
  const res = await instance.get(`/api/kpi/task-handle/${params?.id}`);
  return res.data;
};

const updateKpiMission = async (
  params?: PayloadUpdateKpiMission,
): Promise<MissionAssignedItem> => {
  const res = await instance.patch(`/api/kpi/${params?.id}`, params?.payload);
  return res.data;
};

const getListStatisticKpi = async (params?: PayloadGetStatisticKpi) => {
  const res = await instance.get(
    `/api/kpi/${params?.id}/statistic?${serialize(params?.params)}`,
  );
  return res.data;
};

export default {
  fetchListMissionAssigned,
  createKpiMission,
  getDetailKpiMission,
  updateKpiMission,
  getListStatisticKpi,
  getHandleKpiMission,
};
