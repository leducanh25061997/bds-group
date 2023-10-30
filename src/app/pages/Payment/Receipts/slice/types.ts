import { FilterParams, Pageable } from 'types';
import { ReceiptsStatus, TypePayment } from 'types/Enum';
import { Product } from 'types/ProductTable';
import { WorkFlow } from 'types/Transaction';
import { Staff } from 'types/User';

export interface FilterReceipts {
  status: ReceiptsStatus;
  limt?: number;
  page?: number;
}
export interface receiptState {
  receiptsWaitting?: Pageable<ReceiptsResponse> | null;
  receiptsApprove?: Pageable<ReceiptsResponse> | null;
  isLoading?: boolean;
  isLoadingInfor?: boolean;
  receiptInformation?: ReceiptsResponse | null;
  paramsSearch?: FilterParams;
  ticketId?: string;
}

export interface ApproveReceiptRequest {
  receiptNumber: string;
  receivedDate?: string;
  receivedTime?: string;
  totalPrice: string;
  contentPayment: string;
  typePayment: TypePayment;
  note: string;
  id: string;
}

export interface CancelReceiptRequest {
  reason: string;
  id: string;
}
export interface ReceiptsResponse {
  receiptNumber: string;
  bookingAmountReservation: number;
  code: string;
  contentPayment: string;
  createdAt: string;
  createdTime: string;
  createdDate: string;
  customerId: string;
  id: string;
  note: string;
  paymentDate: string;
  receivedDate: string;
  receivedTime: string;
  status: ReceiptsStatus;
  ticketId: string;
  ticket: TicketProtype;
  totalPrice: number;
  amountPaid: number;
  type: string;
  typePayment: string;
  updatedAt: string;
  customer: Customer;
  transactions: Transactions[];
  workflow: WorkFlow;
  staff: Staff;
}

export interface Transactions {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountPaid: number;
  phaseName: string;
  paidDate: string;
  isCalCommission: boolean;
  receiptId: string;
}

interface Customer {
  address: string;
  birth: string;
  code: string;
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
  proposedSolutions: string;
  province: string;
  purchaseRate: string;
  satisfactionRate: string;
  socialApp: string;
  source: string;
  status: string;
  street: string;
  typeIdentification: string;
  updatedAt: string;
  ward: string;
  workHistory: string;
}
interface TicketProtype {
  accountNumber: string;
  bank: string;
  bankLoanNeeds: boolean;
  code: string;
  createdAt: string;
  createdBy: string;
  depositCode: string;
  id: string;
  nodeName: string;
  note: string;
  otherProjects: boolean;
  paymentCode: string;
  payments: string;
  productCode: string;
  project: ProjectProtype;
  projectId: string;
  staffId: string;
  status: string;
  tax: string;
  updatedAt: string;
  currentNodeId: string;
  product: Product;
  staff: Staff;
}

interface ProjectProtype {
  address: string;
  area: number;
  code: string;
  createdAt: string;
  description: string;
  district: string;
  endPrice: number;
  fileId: string;
  form: string;
  id: string;
  investor: string;
  isEsalekit: boolean;
  name: string;
  ownershipForm: string;
  projectSetting: ProjectSettingProtype;
  province: string;
  ratioCommission: number;
  scale: number;
  startPrice: number;
  status: string;
  type: string;
  updatedAt: string;
  ward: string;
}

interface ProjectSettingProtype {
  bookingAmountReservation: number;
  calculatedByWorkingDays: boolean;
  cashCollectionAccountant: boolean;
  contactCreationProcessId: string;
  contractIssuanceTime: number;
  createdAt: string;
  debtReminderTime1: string;
  debtReminderTime2: string;
  depositProcessId: string;
  endDate: string;
  endTime: string;
  id: string;
  interestCalculationDays: number;
  latePaymentInterest: number;
  numberOfDays: number;
  productCount: number;
  projectId: string;
  registerTime: number;
  reservationProcessId: string;
  reservationRefundProcessId: string;
  startDate: string;
  startTime: string;
  updatedAt: string;
  salesUnit: string[];
}
