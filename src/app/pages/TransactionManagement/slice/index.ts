import { PayloadAction } from '@reduxjs/toolkit';
import { FilterParams, Pageable } from 'types';
import {
  CanceledItem,
  PayloadGetListReservationApproved,
  ReservationItem,
} from 'types/Transaction';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
  PriorityStatus
} from 'types/Enum';
import {
  ChangeStatusPriorityParams,
  DatatablePriorityParam,
} from 'types/ProductTable';

import {
  DepositItem,
  PayloadDeleteTicketReservation,
  PayloadSendTicketReservation,
} from '../../../../types/Transaction';
import { SettingTableProductProtype } from '../components/ApartmentInformationManagement/slice/types';

import { TransactionManagementSaga } from './saga';
import {
  CanceledRequest,
  OrderTicketRequest,
  PayloadCreateTicketReservation,
  PayloadGetBookingDetail,
  PayloadGetListConfirmTicket,
  PayloadTicketAction,
  PayloadUpdateReservation,
  TicketApprove,
  TransactionManagementState,
} from './type';

export const initialState: TransactionManagementState = {
  isLoading: {},
  isDetail: true,
};

const slice = createSlice({
  name: 'transactionManagementSlice',
  initialState,
  reducers: {
    getDetailBooking: (
      state,
      action: PayloadAction<PayloadGetBookingDetail>,
    ) => {
      state.isLoading = { ...state.isLoading, [action.type]: true };
    },
    getDetailBookingSuccess: (state, action) => {
      const getDetailBookingActionType =
        'transactionManagementSlice/getDetailBooking';

      state.isLoading = {
        ...state.isLoading,
        [getDetailBookingActionType]: false,
      };
      state.bookingDetail = action.payload;
    },
    fetchListReservation(state, action) {
      if (!action.payload?.skipLoading) {
        state.isLoading = { ...state.isLoading, [action.type]: true };
      }
    },
    fetchListReservationSuccess: (
      state,
      action: PayloadAction<Pageable<ReservationItem>>,
    ) => {
      const fetchListActionType =
        'transactionManagementSlice/fetchListReservation';
      state.reservationManagement = action.payload;
      state.isLoading = {
        ...state.isLoading,
        [fetchListActionType]: false,
      };
    },

    fetchListDeposit(state, action) {
      if (!action.payload?.skipLoading) {
        state.isLoading = { ...state.isLoading, [action.type]: true };
      }
    },
    fetchListDepositSuccess: (
      state,
      action: PayloadAction<Pageable<DepositItem>>,
    ) => {
      const fetchListDepositActionType =
        'transactionManagementSlice/fetchListDeposit';
      state.depositManagement = action.payload;
      state.isLoading = {
        ...state.isLoading,
        [fetchListDepositActionType]: false,
      };
    },

    fetchListCanceled(state, action) {
      if (!action.payload?.skipLoading) {
        state.isLoading = { ...state.isLoading, [action.type]: true };
      }
    },
    fetchListCanceledSuccess: (
      state,
      action: PayloadAction<Pageable<CanceledItem>>,
    ) => {
      const fetchListCanceledActionType =
        'transactionManagementSlice/fetchListCanceled';
      state.canceledManagement = action.payload;
      state.isLoading = {
        ...state.isLoading,
        [fetchListCanceledActionType]: false,
      };
    },

    sendTicketReservation: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadSendTicketReservation,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    sendTicketReservationSuccess: () => {},
    deleteTicketReservation: {
      reducer(state) {
        return state;
      },
      prepare(
        params: PayloadDeleteTicketReservation,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    deleteTicketReservationSuccess: () => {},
    createTicketReservation: {
      reducer(state) {
        const createTicketActionType =
          'transactionManagementSlice/createTicket';
        state.isLoading = {
          ...state.isLoading,
          [createTicketActionType]: true,
        };
        return state;
      },
      prepare(
        params: PayloadCreateTicketReservation,
        meta: (error?: any) => void,
      ) {
        return { payload: params, meta };
      },
    },
    createTicketReservationSuccess: state => {
      const createTicketActionType = 'transactionManagementSlice/createTicket';
      state.isLoading = {
        ...state.isLoading,
        [createTicketActionType]: false,
      };
    },
    updateTicketReservation: {
      reducer(state) {
        const updateTicketActionType =
          'transactionManagementSlice/updateTicket';
        state.isLoading = {
          ...state.isLoading,
          [updateTicketActionType]: true,
        };
        return state;
      },
      prepare(params: PayloadUpdateReservation, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    updateTicketReservationSuccess: state => {
      const updateTicketActionType = 'transactionManagementSlice/updateTicket';
      state.isLoading = {
        ...state.isLoading,
        [updateTicketActionType]: false,
      };
    },
    doTicketAction: {
      reducer(state) {
        return state;
      },
      prepare(params: PayloadTicketAction, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    doTicketActionSuccess: () => {},
    clearDataBookingDetail(state) {
      state.bookingDetail = null;
    },
    clearListReservation(state) {
      state.reservationManagement = undefined;
    },
    clearListDeposit(state) {
      state.depositManagement = undefined;
    },
    clearListCanceled(state) {
      state.canceledManagement = undefined;
    },
    fetchListReservationApproved(
      state,
      action: PayloadAction<PayloadGetListReservationApproved>,
    ) {
      state.isLoading = { ...state.isLoading, [action.type]: true };
    },
    fetchListReservationApprovedSuccess: (
      state,
      action: PayloadAction<Pageable<ReservationItem>>,
    ) => {
      const fetchListReservationApprovedActionType =
        'transactionManagementSlice/fetchListReservationApproved';
      state.reservationApprovedManagement = action.payload;
      state.isLoading = {
        ...state.isLoading,
        [fetchListReservationApprovedActionType]: false,
      };
    },

    changeStatusPriority: {
      reducer(state) {
        return state;
      },
      prepare(params: ChangeStatusPriorityParams, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    changeStatusPrioritySuccess: () => {},

    clearDatatableProirity(state) {
      state.datatabelePriority = null;
    },

    fetchDatatableProirity(
      state,
      action: PayloadAction<DatatablePriorityParam>,
    ) {
      state.datatabelePriority = null;
    },
    fetchDatatableProiritySuccess(
      state,
      action: PayloadAction<SettingTableProductProtype>,
    ) {
      state.datatabelePriority = action.payload;
    },
    fetchDatatableProirityFaild(state) {
      state.datatabelePriority = null;
    },

    fetchTicketApprove(state, action: PayloadAction<string>) {
      state.ticketApprove = null;
    },
    fetchTicketApproveSuccess(state, action: PayloadAction<TicketApprove[]>) {
      state.ticketApprove = action.payload;
    },
    fetchTicketApproveyFaild(state) {
      state.ticketApprove = null;
    },

    createProductPriority: {
      reducer(state) {
        return state;
      },
      prepare(params: OrderTicketRequest, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    createProductPrioritySuccess: () => {},

    setSettingSalesProgramId(state, action) {
      state.settingSalesProgramId = action.payload;
    },

    doCanceledReservation: {
      reducer(state) {
        return state;
      },
      prepare(params: CanceledRequest, meta: (error?: any) => void) {
        return { payload: params, meta };
      },
    },
    doCanceledReservationSuccess: () => {},

    setPriorityStatus(state, action: PayloadAction<PriorityStatus>) {
      state.priorityStatus = action.payload;
    },

    remmovePriorityStatus(state) {
      state.priorityStatus = null;
    },

    fetchListProductSale(state, action) {
      state.isLoading = { ...state.isLoading, [action.type]: true };
    },
    fetchListProductSaleSuccess: (
      state,
      action: PayloadAction<Pageable<ReservationItem>>,
    ) => {
      const fetchListActionType =
        'transactionManagementSlice/fetchListProductSale';
      state.listProductSale = action.payload;
      state.isLoading = {
        ...state.isLoading,
        [fetchListActionType]: false,
      };
    },
    clearListProductSale(state) {
      state.listProductSale = undefined;
    },
    updateParamsSearchKeySearch(state, action: PayloadAction<string>) {
      if (state.paramsSearch) {
        state.paramsSearch = {
          ...state.paramsSearch,
          search: action.payload,
        };
      }
    },
    updateParamsSearchKeyNodeName(state, action: PayloadAction<string>) {
      if (state.paramsSearch) {
        state.paramsSearch = {
          ...state.paramsSearch,
          nodeName: action.payload,
        };
      }
    },
    updateParamsSearch(state, action: PayloadAction<FilterParams>) {
      const oldNodeName = state.paramsSearch?.nodeName;
      state.paramsSearch = action.payload;
      if (oldNodeName) {
        state.paramsSearch.nodeName = oldNodeName;
      }
    },
    clearParamsSearch(state) {
      state.paramsSearch = undefined;
    },

    resetPriorityStatus(state) {
      state.priorityStatus = null;
    },

    fetchTicketCanOrder(state, action: PayloadAction<string>) {
      state.ticketCanOrder = null;
    },
    fetchTicketCanOrderSuccess(state, action: PayloadAction<TicketApprove[]>) {
      state.ticketCanOrder = action.payload;
    },
    fetchTicketCanOrderFaild(state) {
      state.ticketCanOrder = null;
    },
    changeView(state, action: PayloadAction<boolean>) {
      state.isDetail = action.payload;
    },
    getListStaffInProject(state, action) {},
    getListStaffInProjectSuccess: (state, action) => {
      state.ListStaffInProject = action.payload;
    },

    getListPrintTicket: (
      state,
      action: PayloadAction<PayloadGetListConfirmTicket>,
    ) => {
      state.isLoading = { ...state.isLoading, [action.type]: true };
    },
    getListPrintTicketSuccess: (state, action) => {
      state.ListPrintTicket = action.payload;
    },

    clearListPrintTicket(state) {
      state.ListPrintTicket = null;
    },
  },
});
export const useTransactionManagementSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: TransactionManagementSaga });
  return { actions: slice.actions };
};

export const { actions: transactionManagementActions } = slice;
