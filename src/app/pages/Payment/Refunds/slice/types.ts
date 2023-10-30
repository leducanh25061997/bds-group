import { FilterParams, Pageable } from 'types';
import { RefundsStatus, TypePayment } from 'types/Enum';
import { Product } from 'types/ProductTable';
import { WorkFlow } from 'types/Transaction';
import { Staff } from 'types/User';

export interface FilterRefunds {
  status: RefundsStatus;
  limt?: number;
  page?: number;
}

export interface refundState {
  refundsWaitting?: Pageable<RefundsResponse> | null;
  refundsApprove?: Pageable<RefundsResponse> | null;
  isLoading?: boolean;
  isLoadingInfor?: boolean;
  refundInformation?: RefundsResponse | null;
  paramsSearch?: FilterParams;
}

export interface RefundsResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  status: RefundsStatus;
  code: string;
  note: string;
  amountPaid: number;
  contentPayment: string;
  createDate: string;
  receivedDate: string;
  receivedTime: string;
  reason: string;
  typePayment: string;
  customerId: string;
  ticketId: string;
  ticket: TicketProtype;
  customer: Customer;
  workflow: WorkFlow;
  refundNumber?: string;
  staff: Staff
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
  product?: Product;
  staff: Staff
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

export interface ApproveRefundRequest {
  refundNumber: string;
  receivedDate?: string;
  receivedTime?: string;
  contentPayment: string;
  typePayment: TypePayment;
  note: string;
  id: string;
}

export interface CancelRefundRequest {
  reason: string;
  id: string;
}
