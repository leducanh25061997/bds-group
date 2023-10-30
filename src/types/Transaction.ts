import {
  PaymentMethods,
  PaymentsInfo,
} from 'app/pages/TransactionManagement/slice/type';
import {
  PhaseStatusEnum,
  PriorityStatus,
  ProductTicketTypeEnum,
} from 'types/Enum';

import { EventStatusEnum, StatusProductEnum, WorkFlowTypeEnum } from './Enum';
import { CustomerItem, OrgChart, Staff, User } from './User';
import { FilterParams } from './Filter';

export interface BookingDetail {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  status: string;
  nodeName: any;
  paymentCode: string;
  payments: PaymentsInfo;
  paymentMethod: PaymentMethods;
  tax: string;
  bank: string;
  accountNumber: string;
  bankLoanNeeds: boolean;
  otherProjects: boolean;
  note: string;
  staffId: string;
  createdBy: string;
  mainCustomerCode: string;
  cashCollectionAccountant: boolean;
  listCustomers?: CustomerItem[];
  depositCode: string;
  customers: CustomerInReservation[];
  staff: Staff;
  user: User;
  exchanges: OrgChart;
  files?: FileNewInterface[];
  recordApproveTickets: RecordApprovedTickets[];
  workFlow: WorkFlow;
  currentNodeId: string;
  productId?: string;
  product: ProductInfo | null;
  projectId: string;
  isPriority: boolean;
}

export interface ReservationItem {
  //interface in database
  id: string;
  code: string;
  nodeName?: string;
  paymentCode?: string;
  payments: string;
  paymentMethod: string;
  tax: string;
  bank: string;
  accountNumber: string;
  bankLoanNeeds: boolean;
  otherProjects: boolean;
  note: string;
  staffId: string;
  status: string;
  customers: CustomerInReservation[];
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  saleUnit?: string;
  staffName?: string;
  staff: Staff;
  exchanges: OrgChart;
  user: User;
  files?: FileNewInterface;
  depositCode?: string;
  refund: RefundItem;
  receipts: ReceiptsItem[];
  product: ProductInfo | null;
  projectId: string;
  canceledAt: string | null;
}

export interface ReceiptsItem {
  amountPaid: number;
  bookingAmountReservation: number;
  code: string;
  contentPayment: string;
  createdAt: string;
  createdDate: string;
  customerId: string;
  id: string;
  note: string;
  paymentDate: string;
  reason: string;
  receiptNumber: string;
  receivedDate: string;
  receivedTime: string;
  status: string;
  ticketId: string;
  totalPrice: number;
  type: string;
  typePayment: string;
  updatedAt: string;
}

interface RefundItem {
  amountPaid?: number;
  code?: string;
  contentPayment?: string;
  createdAt?: string;
  createdDate?: string;
  customerId?: string;
  id?: string;
  note?: string;
  reason?: string;
  receivedDate?: string;
  receivedTime?: string;
  refundNumber?: string;
  status?: string;
  ticketId?: string;
  typePayment?: string;
  updatedAt?: string;
}

interface FileNewInterface {
  field: string;
  filedId: string;
  id: string;
  ticketId?: string;
  createdAt?: string;
  updatedAt?: string;
  file: FileDatabase;
}

export interface RecordApprovedTickets {
  createdAt: string;
  updatedAt: string;
  id: string;
  status: RecordApprovalStatus;
  nodeName: string;
  nodeId: string;
  reason: string | null;
  user: User;
}

export interface FileDatabase {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  path?: string;
  receiptId?: string | null;
  ticketId?: string;
}

export interface WorkFlow {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  type: WorkFlowTypeEnum;
  isAutoChangeStep: boolean;
  firstNode: string;
  workFlows: {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    code: string;
    typeTimeOut: string;
    timeOut: number;
    staffs: Staff[];
  }[];
}

export interface DepositItem extends ReservationItem {
  id_contract?: string;
  id_product?: string;
  price?: string;

  depositCode: string;
}

export interface CanceledItem extends ReservationItem {}

//   id: string;
//   code: string;
//   nodeName?: string;
//   paymentCode?: string;
//   payments: string;
//   tax: string;
//   bank: string;
//   accountNumber: string;
//   bankLoanNeeds: boolean;
//   otherProjects: boolean;
//   note: string;
//   staffId: string;
//   status: string;
//   customers: CustomerInReservation[];
//   createdAt: string;
//   createdBy?: string;
//   updatedAt: string;
//   saleUnit?: string;
//   staffName?: string;
//   exchanges: ExchangesType;
// }

interface ExchangesType {
  name: string;
  code: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}
export interface CustomerInReservation {
  id: string;
  mainCustomer: CustomerItem | null;
  subCustomer: CustomerItem;
}

export interface ProductInfo {
  createdAt: string;
  updatedAt: string;
  id: string;
  block: string;
  code: string;
  projectId: string;
  price: number;
  priceVat: number;
  unitPrice: number;
  unitPriceVat: number;
  area: number;
  status: StatusProductEnum;
  type: string;
  corner: string;
  floor: string;
  showPrice: boolean;
  position: string;
  bedRoom: number;
  subscription: any;
  note: any;
  builtUpArea: number;
  carpetArea: number;
  imageUrl: any;
  extendOrgChartId: string;
  signUpAt: any;
}

export enum StatusReservation {
  RESERVATION = 'CREATE_TICKET',
  DEPOSIT = 'CREATE_DEPOSIT',
}

export enum RecordApprovalStatus {
  APPROVED_TICKET = 'APPROVED_TICKET',
  REFUSE_TICKET = 'REFUSE_TICKET',

  APPROVED_DEPOSIT = 'APPROVED_DEPOSIT',
  REFUSE_DEPOSIT = 'REFUSE_DEPOSIT',

  APPROVED_CANCELED = 'APPROVED_CANCELED',
  REFUSE_CANCELED = 'REFUSE_CANCELED',
}

export interface PayloadSendTicketReservation {
  ticketId: string;
}
export interface PayloadDeleteTicketReservation {
  id: string;
}

export interface PayloadGetListReservationApproved extends FilterParams {
  isProduct?: ProductTicketTypeEnum;
}

export interface EventSales {
  createdAt: string;
  updatedAt: string;
  id: string;
  isStart: boolean;
  salesProgramId: string;
  currentPhase: PhaseStatusEnum;
  currentPriority: string;
  salesProgram: SalesProgram;
  projectId: string;
  status: EventStatusEnum;
  phases: PhaseEnum[];
}

export enum PhaseEnum {
  PHASE_1 = 'PHASE_1',
  PHASE_2 = 'PHASE_2',
}

export interface SalesProgram {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  isPriority: boolean;
  priorityStatus: PriorityStatus;
  status: string;
  productNumber: number;
  isHiddenPrice: boolean;
  openSaleProducts: OpenSaleProducts[];
  projectId: string;
}

interface OpenSaleProducts {
  blockName: string;
  floor: string;
  products: string[];
}
