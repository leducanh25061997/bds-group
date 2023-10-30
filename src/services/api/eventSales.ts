import {
  EventPermission,
  EventReport,
  EventSalesInfo,
  MovingProducts,
  Notifications,
  PayloadCheckEventPermission,
  PayloadEndEvent,
  PayloadExportEventReport,
  PayloadGetMovingProducts,
  PayloadGetNotification,
  PayloadGetReport,
  PayloadMoveProducts,
  PayloadSendEmailEndPhase,
  PayloadStartEvent,
  PayloadUpdatePhase,
  PayloadUpdatePriority,
} from 'app/pages/SaleEventControl/slice/types';
import { Product } from 'types/ProductTable';

import { createService, downloadFileService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);
const instanceDownload = downloadFileService(process.env.REACT_APP_API_URL);

const fetchEventSales = async (params: {
  id: string;
}): Promise<EventSalesInfo> => {
  const res = await instance.get(`/api/event-sales/${params.id}`);

  return res.data;
};

const startEvent = async (params: PayloadStartEvent): Promise<any> => {
  const res = await instance.post(`/api/event-sales/start`, params);

  return res.data;
};

const updateEventPhase = async (params: PayloadUpdatePhase): Promise<any> => {
  const { id, phase } = params;

  const res = await instance.patch(`/api/event-sales/phase/${id}`, {
    phase,
  });

  return res.data;
};

const getNotification = async (
  params: PayloadGetNotification,
): Promise<Notifications> => {
  const res = await instance.get(
    `/api/event-sales/get-notification/${params.id}`,
  );

  return res.data;
};

const updateEventPriority = async (
  params: PayloadUpdatePriority,
): Promise<any> => {
  const { id, priority } = params;
  const res = await instance.patch(`/api/event-sales/priority/${id}`, {
    priority,
  });

  return res.data;
};

const getMovingProducts = async (
  params: PayloadGetMovingProducts,
): Promise<MovingProducts> => {
  const res = await instance.get(`/api/event-sales/${params.id}/products`);

  return res.data;
};

const moveProductsToSecondPhase = async (params: PayloadMoveProducts) => {
  const { id, productIds } = params;
  const res = await instance.patch(`/api/event-sales/${id}/move-to-phase2`, {
    productIds,
  });

  return res.data;
};

const endEvent = async (params: PayloadEndEvent) => {
  const res = await instance.post(`/api/event-sales/end`, params);

  return res.data;
};

const getReport = async (params: PayloadGetReport): Promise<EventReport> => {
  const res = await instance.get(`/api/event-sales/report/${params.id}`);

  return res.data;
};

const sendEmailEndPhase = async (
  params: PayloadSendEmailEndPhase,
): Promise<any> => {
  const res = await instance.post(
    `/api/event-sales/send-noti-end-phase`,
    params,
  );

  return res.data;
};

const exportEventReport = async (
  params: PayloadExportEventReport,
): Promise<any> => {
  const res = await instanceDownload.get(
    `/api/event-sales/report-event-sales/${params.id}`,
  );

  return res.data;
};

const checkEventPermission = async (
  params: PayloadCheckEventPermission,
): Promise<EventPermission> => {
  const res = await instance.post(`/api/event-sales/check-permission`, params);

  return res.data;
};

export default {
  fetchEventSales,
  startEvent,
  updateEventPhase,
  updateEventPriority,
  getNotification,
  getMovingProducts,
  moveProductsToSecondPhase,
  endEvent,
  getReport,
  sendEmailEndPhase,
  exportEventReport,
  checkEventPermission,
};
