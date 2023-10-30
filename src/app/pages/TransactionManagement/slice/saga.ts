import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { FilterParams, Pageable } from 'types';
import {
  DepositItem,
  ReservationItem,
  BookingDetail,
  CanceledItem,
} from 'types/Transaction';
import Transaction from 'services/api/transaction';
import productTable from 'services/api/productTable';
import {
  ChangeStatusPriorityParams,
  DatatablePriorityParam,
} from 'types/ProductTable';
import { PayloadGetListStaffInProject } from 'app/pages/Staff/slice/types';
import Staff from 'services/api/staff';

import {
  PayloadSendTicketReservation,
  PayloadDeleteTicketReservation,
} from '../../../../types/Transaction';
import { SettingTableProductProtype } from '../components/ApartmentInformationManagement/slice/types';
import { StaffItem } from '../../ProcessManagement/slice/type';

import {
  PayloadCreateTicketReservation,
  PayloadUpdateReservation,
  PayloadGetBookingDetail,
  PayloadTicketAction,
  TicketApprove,
  OrderTicketRequest,
  CanceledRequest,
  PayloadGetListProduct,
  PayloadGetListConfirmTicket,
  PrintTicketItem,
} from './type';

import { transactionManagementActions as actions } from '.';

let scheduleLoadTable: any;
function* fetchListReservation(action: PayloadAction<FilterParams>) {
  try {
    scheduleLoadTable = Date.now();
    const cacheTime = scheduleLoadTable;
    yield delay(500);
    if (cacheTime !== scheduleLoadTable) return;
    const result: Pageable<ReservationItem> = yield call(
      Transaction.fetchListReservation,
      action.payload,
    );
    yield put(actions.fetchListReservationSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListReservationSuccess(defaultObjectErrorReturn));
  }
}

function* fetchListDeposit(action: PayloadAction<FilterParams>) {
  try {
    scheduleLoadTable = Date.now();
    const cacheTime = scheduleLoadTable;
    yield delay(500);
    if (cacheTime !== scheduleLoadTable) return;
    const result: Pageable<DepositItem> = yield call(
      Transaction.fetchListDeposit,
      action.payload,
    );
    yield put(actions.fetchListDepositSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListDepositSuccess(defaultObjectErrorReturn));
  }
}

function* fetchListCanceled(action: PayloadAction<FilterParams>) {
  try {
    scheduleLoadTable = Date.now();
    const cacheTime = scheduleLoadTable;
    yield delay(500);
    if (cacheTime !== scheduleLoadTable) return;
    const result: Pageable<CanceledItem> = yield call(
      Transaction.fetchListCanceled,
      action.payload,
    );
    yield put(actions.fetchListCanceledSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListCanceledSuccess(defaultObjectErrorReturn));
  }
}

function* sendTicketReservation(
  action: PayloadAction<
    PayloadSendTicketReservation,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Transaction.sendTicketReservation, action.payload);
    yield put(actions.sendTicketReservationSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}

function* deleteTicketReservation(
  action: PayloadAction<
    PayloadDeleteTicketReservation,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Transaction.deleteTicketReservation, action.payload);
    yield put(actions.deleteTicketReservationSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      response: error.response,
    });
  }
}

function* createTicketReservation(
  action: PayloadAction<
    PayloadCreateTicketReservation,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Transaction.createTicketReservation, action.payload);
    yield put(actions.createTicketReservationSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    yield put(actions.createTicketReservationSuccess());
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}
function* updateTicketReservation(
  action: PayloadAction<
    PayloadUpdateReservation,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(Transaction.updateTicketReservation, action.payload);
    yield put(actions.updateTicketReservationSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    yield put(actions.updateTicketReservationSuccess());
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}
function* getDetailBookingSaga(action: PayloadAction<PayloadGetBookingDetail>) {
  try {
    const result: BookingDetail = yield call(
      Transaction.getDetailBooking,
      action.payload,
    );
    yield put(actions.getDetailBookingSuccess(result));
  } catch (errors) {}
}

function* doTicketAction(
  action: PayloadAction<PayloadTicketAction, string, (error?: any) => void>,
) {
  try {
    yield call(Transaction.ticketAction, action.payload);
    yield put(actions.doTicketActionSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      code: error.code,
      response: error.response,
    });
  }
}

function* fetchListReservationApproved(action: PayloadAction<FilterParams>) {
  try {
    const result: Pageable<ReservationItem> = yield call(
      Transaction.fetchListReservationApproved,
      action.payload,
    );
    yield put(actions.fetchListReservationApprovedSuccess(result));
  } catch (errors) {}
}

function* changeStatusPriority(
  action: PayloadAction<
    ChangeStatusPriorityParams,
    string,
    (error?: any) => void
  >,
) {
  try {
    yield call(productTable.changeStatusPriority, action.payload);
    yield put(actions.changeStatusPrioritySuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      message: error.response.data.message,
    });
  }
}

function* fetchDatatableProirity(
  action: PayloadAction<DatatablePriorityParam>,
) {
  try {
    const result: SettingTableProductProtype = yield call(
      productTable.fetchDatatableProirity,
      action.payload,
    );
    yield put(actions.fetchDatatableProiritySuccess(result));
  } catch (error) {
    yield put(actions.fetchDatatableProirityFaild());
  }
}

function* fetchTicketApprove(action: PayloadAction<string>) {
  try {
    const result: TicketApprove[] = yield call(
      productTable.fetchTicketApprove,
      action.payload,
    );
    yield put(actions.fetchTicketApproveSuccess(result));
  } catch (error) {
    yield put(actions.fetchTicketApproveyFaild());
  }
}

function* createProductPriority(
  action: PayloadAction<OrderTicketRequest, string, (error?: any) => void>,
) {
  try {
    yield call(productTable.createOrderTicket, action.payload);
    yield put(actions.createProductPrioritySuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      message: error.response.data.message,
    });
  }
}

function* doCanceledReservation(
  action: PayloadAction<CanceledRequest, string, (error?: any) => void>,
) {
  try {
    yield call(productTable.doCanceledReservation, action.payload);
    yield put(actions.doCanceledReservationSuccess());
    action.meta({
      success: true,
    });
  } catch (error: any) {
    action.meta({
      success: false,
      message: error.response.data.message,
    });
  }
}

function* fetchListProductSale(action: PayloadAction<PayloadGetListProduct>) {
  try {
    const result: Pageable<any> = yield call(
      Transaction.fetchListProduct,
      action.payload,
    );
    yield put(actions.fetchListProductSaleSuccess(result));
  } catch (errors) {
    const defaultObjectErrorReturn = { data: [], total: 0 };
    yield put(actions.fetchListProductSaleSuccess(defaultObjectErrorReturn));
  }
}

function* fetchTicketCanOrder(action: PayloadAction<string>) {
  try {
    const result: TicketApprove[] = yield call(
      productTable.fetchTicketCanOrder,
      action.payload,
    );
    yield put(actions.fetchTicketCanOrderSuccess(result));
  } catch (error) {
    yield put(actions.fetchTicketCanOrderFaild());
  }
}

function* getListStaffInProject(
  action: PayloadAction<PayloadGetListStaffInProject>,
) {
  try {
    const result: StaffItem[] = yield call(
      Staff.getListStaffInProject,
      action.payload,
    );
    yield put(actions.getListStaffInProjectSuccess(result));
  } catch (errors) {}
}

function* getListPrintTicketSagas(
  action: PayloadAction<PayloadGetListConfirmTicket>,
) {
  try {
    const result: PrintTicketItem[] = yield call(
      productTable.getListPrintTicket,
      action.payload,
    );
    yield put(actions.getListPrintTicketSuccess(result));
  } catch (errors) {}
}

export function* TransactionManagementSaga() {
  yield takeLatest(actions.fetchListReservation.type, fetchListReservation);
  yield takeLatest(actions.fetchListDeposit.type, fetchListDeposit);
  yield takeLatest(actions.fetchListCanceled.type, fetchListCanceled);
  yield takeLatest(actions.sendTicketReservation.type, sendTicketReservation);
  yield takeLatest(
    actions.deleteTicketReservation.type,
    deleteTicketReservation,
  );
  yield takeLatest(
    actions.createTicketReservation.type,
    createTicketReservation,
  );
  yield takeLatest(
    actions.updateTicketReservation.type,
    updateTicketReservation,
  );
  yield takeLatest(actions.getDetailBooking.type, getDetailBookingSaga);
  yield takeLatest(actions.doTicketAction.type, doTicketAction);
  yield takeLatest(
    actions.fetchListReservationApproved.type,
    fetchListReservationApproved,
  );
  yield takeLatest(actions.changeStatusPriority.type, changeStatusPriority);
  yield takeLatest(actions.fetchDatatableProirity.type, fetchDatatableProirity);
  yield takeLatest(actions.fetchTicketApprove.type, fetchTicketApprove);
  yield takeLatest(actions.createProductPriority.type, createProductPriority);
  yield takeLatest(actions.doCanceledReservation.type, doCanceledReservation);
  yield takeLatest(actions.fetchListProductSale.type, fetchListProductSale);
  yield takeLatest(actions.fetchTicketCanOrder.type, fetchTicketCanOrder);
  yield takeLatest(actions.getListStaffInProject.type, getListStaffInProject);
  yield takeLatest(actions.getListPrintTicket.type, getListPrintTicketSagas);
}
