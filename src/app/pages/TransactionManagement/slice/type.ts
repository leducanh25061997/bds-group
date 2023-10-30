import { Pageable, FilterParams } from 'types';
import {
  DepositItem,
  ReservationItem,
  BookingDetail,
  CanceledItem,
} from 'types/Transaction';
import { ApplicableStatus, PriorityAssemblyLock, PriorityStatus } from 'types/Enum';
import { CustomerItem, Image } from 'types/User';

import { SettingTableProductProtype } from '../components/ApartmentInformationManagement/slice/types';
import { StaffItem } from '../../ProcessManagement/slice/type';

export interface TransactionManagementState {
  reservationManagement?: Pageable<ReservationItem>;
  depositManagement?: Pageable<DepositItem>;
  canceledManagement?: Pageable<CanceledItem>;
  bookingDetail?: BookingDetail | null;
  reservationApprovedManagement?: Pageable<ReservationItem>;
  isLoading: Record<string, boolean>;
  datatabelePriority?: SettingTableProductProtype | null;
  ticketApprove?: TicketApprove[] | null;
  settingSalesProgramId?: string;
  priorityStatus?: PriorityStatus | null;
  listProductSale?: Pageable<any>;
  paramsSearch?: FilterParams;
  ticketCanOrder?: TicketApprove[] | null;
  isDetail: boolean;
  ListStaffInProject?: Pageable<StaffItem>;
  ListPrintTicket?: PrintTicketItem[] | null;
}

export interface TicketApprove {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  depositCode: string;
  status: string;
  nodeName: string;
  currentNodeId: string;
  paymentCode: string;
  payments: string;
  tax: string;
  bank: string;
  accountNumber: string;
  bankLoanNeeds: boolean;
  otherProjects: boolean;
  note: string;
  projectId: string;
  staffId: string;
  createdBy: string;
  productId: string;
  staff: Staff;
  user: User;
  customers: Customers[];
  isPriority: boolean;
}

export interface Customers {
  id: string;
  mainCustomer: MainCustomer;
}

export interface PrintTicketItem {
  createdAt: string
  updatedAt: string
  id: string
  fileId: string
  applicableStatus: string[]
  projectId: string
  image: Image
}

interface MainCustomer {
  address: string;
  birth: string;
  code: string;
  companyCode: string;
  companyDateRange: string;
  companyIssuedBy: string;
  companyName: string;
  createdAt: string;
  dateRange: string;
  description: string;
  district: string;
  email: string;
  feedback: string;
  gender: string;
  groupType: string;
  id: string;
  identityNumber: string;
  informationExchanged: string;
  issuedBy: string;
  meetingAt: string;
  meetingForm: string;
  mentionedProject: string;
  name: string;
  note: string;
  otherSource: string;
  phoneNumber: string;
  position: string;
  proposedSolutions: string;
  province: string;
  purchaseRate: string;
  satisfactionRate: string;
  socialApp: string;
  source: string;
  status: string;
  street: string;
  type: string;
  typeIdentification: string;
  updatedAt: string;
  ward: string;
  workHistory: string;
}
interface User {
  createdAt: string;
  updatedAt: string;
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  roleId: string;
  staffId: string;
}
interface Staff {
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: string;
  staffStatus: boolean;
  fullName: string;
  birthDay: string;
  code: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  typeIdentification: string;
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
  workingUnit: string;
  staffLevel: string;
  commission: number;
  orgChart: OrgChart;
}

interface OrgChart {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  name: string;
  status: boolean;
  xPath: string;
}
export interface PayloadGetBookingDetail {
  id: string;
}

export interface PayloadGetListConfirmTicket {
  applicableStatus: ApplicableStatus
  projectId: string
}

export interface PayloadGetListProduct {
  projectId: string;
}
export interface PayloadCreateTicketReservation {
  code?: string;
  nodeName?: string;
  paymentCode?: string;
  payments?: string;
  tax?: string;
  bank?: string;
  accountNumber?: string;
  bankLoanNeeds?: boolean;
  otherProjects?: boolean;
  note?: string;
  staffId?: string;
  projectId?: string;
  mainCustomerCode?: string;
  listCustomers?: CustomerItem[];
  files?: string[];
  ticketId?: string;
  productId?: string;
}

export interface FormFieldCreateTicketReservation {
  paymentCode: string;
  payments: string;
  tax: string;
  bank: string;
  accountNumber: string;
  bankLoanNeeds: boolean;
  otherProjects: boolean;
  note: string;
  listCoOwnerCustomer: CustomerItem[];
  mainCustomerCode: string;
  typeMainCustomer: string;
  customerMainName: string;
  customerMainGender: string;
  customerMainDate: string;
  customerMainEmail: string;
  customerMainphone: string;
  mainIdentifierTypeCustomer: string;
  mainIdentityNumberCustomer: string;
  mainDateRangCustomer: string;
  mainIssuedByCustomer: string;
}

export enum PaymentsInfo {
  TRANSFER = 'TRANSFER',
  CASH = 'CASH',
}

export enum PaymentMethods {
  FAST = 'FAST',
  STANDARD = 'STANDARD',
  BORROW = 'BORROW',
}

export interface PayloadUpdateReservation {
  id: string;
  payload: PayloadCreateTicketReservation;
}

export interface PayloadTicketAction {
  ticketId: string;
  isApprove: boolean;
  reason?: string;
}

export interface OrderTicketRequest {
  settingSalesProgramId: string;
  productId: string;
  tickets: Tickets[];
}
export interface CanceledRequest {
  ticketId: string;
  files: string[];
}

export interface OpenPriorityAdditional {
  settingSalesProgramId: string;
  listProductAndOrgChart: ListProductAndOrgChart[];
}

interface ListProductAndOrgChart {
  productId: string;
  orgChartId: string;
}
export interface Tickets {
  index: number;
  ticketId: string;
}

export enum StatusTicketReservation {
  CREATE_TICKET = 'CREATE_TICKET',
  APPROVED_TICKET = 'APPROVED_TICKET',
  WAIT_APPROVE_TICKET = 'WAIT_APPROVE_TICKET',
  REFUSE_TICKET = 'REFUSE_TICKET',
}
export enum StatusTicketDeposit {
  CREATE_DEPOSIT = 'CREATE_DEPOSIT',
  WAIT_APPROVE_DEPOSIT = 'WAIT_APPROVE_DEPOSIT',
  APPROVED_DEPOSIT = 'APPROVED_DEPOSIT',
  REFUSE_DEPOSIT = 'REFUSE_DEPOSIT',
}
export enum StatusTicketCanceled {
  CREATE_CANCELED = 'CREATE_CANCELED',
  WAIT_APPROVE_CANCELED = 'WAIT_APPROVE_CANCELED',
  APPROVED_CANCELED = 'APPROVED_CANCELED',
  REFUSE_CANCELED = 'REFUSE_CANCELED',
}
export enum StatusTicketReservationText {
  CREATE_TICKET = 'Tạo phiếu đặt chỗ',
  APPROVED_TICKET = 'Đã duyệt phiếu đặt chỗ',
  WAIT_APPROVE_TICKET = 'Chờ duyệt phiếu đặt chỗ',
  REFUSE_TICKET = 'Từ chối phiếu đặt chỗ',
}
export enum StatusTicketDepositText {
  CREATE_DEPOSIT = 'Tạo phiếu đặt cọc',
  APPROVED_DEPOSIT = 'Đã duyệt phiếu đặt cọc',
  WAIT_APPROVE_DEPOSIT = 'Chờ duyệt phiếu đặt cọc',
  REFUSE_DEPOSIT = 'Từ chối phiếu đặt cọc',
}
export enum StatusTicketCanceledText {
  CREATE_CANCELED = 'Tạo phiếu hủy chỗ - hoàn tiền',
  WAIT_APPROVE_CANCELED = 'Chờ duyệt phiếu hủy chỗ - hoàn tiền',
  APPROVED_CANCELED = 'Đã duyệt phiếu hủy chỗ - hoàn tiền',
  REFUSE_CANCELED = 'Từ chối phiếu hủy chỗ - hoàn tiền',
}
