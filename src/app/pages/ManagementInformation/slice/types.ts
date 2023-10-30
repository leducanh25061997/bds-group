import { ReceiptsStatus, WorkFlowTypeEnum } from 'types/Enum';
import { ProcessType } from 'types/Process';

export interface CreateInformationProjectFormData {
  id?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  registerTime: number;
  productCount: number;
  bookingAmountReservation: number;
  cashCollectionAccountant: boolean;
  contractIssuanceTime: number;
  debtReminderTime1: number;
  debtReminderTime2: number;
  latePaymentInterest: number;
  numberOfDays: number;
  interestCalculationDays: number;
  calculatedByWorkingDays: boolean;
  salesUnitIds: string[];
  projectManagerIds: string[];
  supportDepartmentIds: string[];
  projectId: string;
  reservationProcessId: string;
  depositProcessId: string;
  reservationRefundProcessId: string;
  contactCreationProcessId: string;
}

export interface TransactionProcessData {
  reservation: TransactionProcessResponse[];
  deposit: TransactionProcessResponse[];
  canceledTicket: TransactionProcessResponse[];
  contract: TransactionProcessResponse[];
}
export interface TransactionProcessResponse {
  createdAt: string;
  firstNode: string;
  id: string;
  isAutoChangeStep: boolean;
  name: string;
  type: WorkFlowTypeEnum;
  updatedAt: string;
}

export interface ProjectManager {
  birthDay: string;
  code: string;
  commission: number;
  createdAt: string;
  dateRange: string;
  email: string;
  fullName: string;
  gender: string;
  id: string;
  identityNumber: string;
  issuedBy: string;
  phone: string;
  position: string;
  projectManager: SubProjectManager[];
  staffLevel: string;
  staffStatus: boolean;
  typeIdentification: string;
  updatedAt: string;
  userId: string;
  workingUnit: string;
}

interface SubProjectManager {
  bookingAmountReservation: number;
  calculatedByWorkingDays: boolean;
  cashCollectionAccountant: boolean;
  contactCreationProcessId: string;
  contractIssuanceTime: number;
  createdAt: string;
  debtReminderTime1: number;
  debtReminderTime2: number;
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
}
interface SalesUnit {
  code: string;
  createdAt: string;
  id: string;
  name: string;
  projectSetting: SubProjectManager[];
  status: boolean;
  updatedAt: string;
  xPath: string;
}

interface SupportDepartment {
  birthDay: string;
  code: string;
  commission: number;
  createdAt: string;
  dateRange: string;
  email: string;
  fullName: string;
  gender: string;
  id: string;
  identityNumber: string;
  issuedBy: string;
  phone: string;
  position: string;
  staffLevel: string;
  staffStatus: boolean;
  typeIdentification: string;
  updatedAt: string;
  userId: string;
  workingUnit: string;
  supportDepartment: SubProjectManager[];
}
export interface InformationProjectResponse {
  bookingAmountReservation: number;
  calculatedByWorkingDays: boolean;
  cashCollectionAccountant: boolean;
  contactCreationProcessId: string;
  contractIssuanceTime: number;
  createdAt: string;
  debtReminderTime1: number;
  debtReminderTime2: number;
  depositProcessId: number;
  endDate: string;
  endTime: string;
  id: string;
  interestCalculationDays: number;
  latePaymentInterest: number;
  numberOfDays: number;
  productCount: number;
  projectId: number;
  projectManager: ProjectManager[];
  registerTime: number;
  reservationProcessId: string;
  reservationRefundProcessId: string;
  salesUnit: SalesUnit[];
  startDate: string;
  startTime: string;
  supportDepartment: ProjectManager[];
  updatedAt: string;
  project?: {
    name?: string;
  };
}
export interface CreateInformationProjectState {
  createInformationProject?: CreateInformationProjectFormData;
  staffs?: any[];
  transactionProcess?: any;
  informationProject?: InformationProjectResponse | null;
  formData?: any | null;
  isSubmitting?: boolean;
  isWorkflowLoading: boolean;
  isInfoManagementLoading: boolean;
  workFlowInformation?: ProcessType | null;
}
