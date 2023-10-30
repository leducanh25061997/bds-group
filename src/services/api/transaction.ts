import { FilterParams, Pageable } from 'types';

import {
  DepositItem,
  BookingDetail,
  PayloadDeleteTicketReservation,
  PayloadSendTicketReservation,
  ReservationItem,
  CanceledItem,
  PayloadGetListReservationApproved,
} from 'types/Transaction';
import { serialize } from 'utils/helpers';
import {
  PayloadCreateTicketReservation,
  PayloadUpdateReservation,
  PayloadGetBookingDetail,
  PayloadTicketAction,
  PayloadGetListProduct,
} from 'app/pages/TransactionManagement/slice/type';

import {
  TransactionParams,
  CompleteProfileForm,
  CheckPermissionEventSaleParams,
} from 'app/pages/SaleEventTransaction/slice/types';

import { ProductTicketTypeEnum } from 'types/Enum';
import { UpdateVirtualStatusParams } from 'app/pages/virtualTable/slice/types';
import { ProductTableParams } from 'types/ProductTable';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const fetchListReservation = async (
  params?: FilterParams,
): Promise<Pageable<ReservationItem>> => {
  const res = await instance.get(`/api/ticket?${serialize(params)}`);
  return res.data;
};
const fetchListDeposit = async (
  params?: FilterParams,
): Promise<Pageable<DepositItem>> => {
  const res = await instance.get(`/api/ticket?${serialize(params)}`);
  return res.data;
};
const fetchListCanceled = async (
  params?: FilterParams,
): Promise<Pageable<CanceledItem>> => {
  const res = await instance.get(`/api/ticket?${serialize(params)}`);
  return res.data;
};
const createTicketReservation = async (
  params?: PayloadCreateTicketReservation,
) => {
  const res = await instance.post(`/api/ticket`, params);
  return res.data;
};
const updateTicketReservation = async (params?: PayloadUpdateReservation) => {
  const res = await instance.patch(
    `/api/ticket/${params?.id}`,
    params?.payload,
  );
  return res.data;
};
const sendTicketReservation = async (params?: PayloadSendTicketReservation) => {
  const res = await instance.post(`/api/ticket/send-ticket`, params);
  return res.data;
};
const deleteTicketReservation = async (
  params?: PayloadDeleteTicketReservation,
) => {
  const res = await instance.delete(`/api/ticket/${params?.id}`);
  return res.data;
};

const getDetailBooking = async (
  params: PayloadGetBookingDetail,
): Promise<BookingDetail> => {
  const res = await instance.get(`/api/ticket/${params?.id}`);

  return res.data;
};

const ticketAction = async (params: PayloadTicketAction) => {
  const res = await instance.post(`/api/ticket/approve-ticket`, params);
  return res.data;
};

const fetchListReservationApproved = async (
  params?: PayloadGetListReservationApproved,
): Promise<Pageable<ReservationItem>> => {
  const res = await instance.get(
    `/api/ticket/list-ticket-approve?${serialize(params)}`,
  );
  return res.data;
};

const fetchListProduct = async (
  params?: PayloadGetListProduct,
): Promise<Pageable<any>> => {
  const res = await instance.get(
    `/api/product/list-product?${serialize(params)}`,
  );
  return res.data;
};

const fetchTransaction = async (
  params: TransactionParams,
): Promise<Pageable<any>> => {
  const newParams = { ...params };
  if (params.isPriority) {
    newParams.phase = 'START_PHASE_1';
  } else {
    newParams.phase = 'START_PHASE_2';
  }
  const res = await instance.get(
    `/api/event-sales/${params.id}/transaction-list?${serialize(newParams)}`,
  );
  return res.data;
};

const completeProfile = async (params: CompleteProfileForm) => {
  const res = await instance.post(
    `/api/event-sales/products/complete-profile`,
    params,
  );
  return res.data;
};

const addProfile = async (params: CompleteProfileForm) => {
  const res = await instance.post(
    `/api/event-sales/products/add-profile`,
    params,
  );
  return res.data;
};

const checkPermissionEventSale = async (
  params: CheckPermissionEventSaleParams,
) => {
  const res = await instance.post(`/api/event-sales/check-permission`, params);
  return res.data;
};

const fetchDatatable = async (params: ProductTableParams): Promise<any> => {
  const res = await instance.get(
    `/api/product/data-table?${serialize(params)}`,
  );
  return res.data;
};

const fetchSettingTableProduct = async (
  params: ProductTableParams,
): Promise<any> => {
  const res = await instance.get(
    `/api/setting-table-product/${params.idProject}`,
  );
  return res.data;
};

const updateVirtualStatus = async (params?: UpdateVirtualStatusParams) => {
  const res = await instance.patch(
    `/api/product/update-virtual-status`,
    params,
  );
  return res.data;
};

export default {
  fetchListReservation,
  createTicketReservation,
  sendTicketReservation,
  deleteTicketReservation,
  getDetailBooking,
  updateTicketReservation,
  fetchListDeposit,
  fetchListCanceled,
  ticketAction,
  fetchListReservationApproved,
  fetchListProduct,
  fetchTransaction,
  completeProfile,
  addProfile,
  checkPermissionEventSale,
  fetchDatatable,
  fetchSettingTableProduct,
  updateVirtualStatus,
};
