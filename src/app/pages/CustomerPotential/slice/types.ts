import { Pageable } from 'types';
import { CustomerItem, Staff } from 'types/User';
import {
  CustomerGroupType,
  CustomerSourceType,
  CustomerType,
  SocialType,
  Status,
  TYPEIdentification,
} from 'types/Enum';

export interface CustomerState {
  customerManager?: Pageable<CustomerItem>;
  customerManagerTrans?: Pageable<CustomerItem>;
  isLoading?: boolean;
  customerDetail?: CustomerItem | null;
}

export interface PayloadUpdateStatusCustomer {
  id: number | string;
  status: Status;
}

export interface PayloadGetDetailCustomer {
  id: number | string;
  status: Status;
}

export interface PayloadSentApprove {
  approveId: string;
  customerId: string;
}

export interface PayloadCreateCustomer {
  name: string;
  code: string;
  birth: string;
  email: string;
  phoneNumber: string;
  gender: string;
  typeIdentification: TYPEIdentification;
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  address: string;
  note: string;
  status: string;
  source: CustomerSourceType;
  socialApp: SocialType;
  projectName: string;
  groupType: CustomerGroupType;
  meetingAt: string;
  meetingForm: string;
  mentionedProject: string;
  satisfactionRate: number;
  purchaseRate: number;
  workHistory: string;
  informationExchanged: string;
  feedback: string;
  description: string;
  proposedSolutions: string;
  otherSource: string;
  finance: string,
  agree: string,
  otherReason: string,
  evaluation: string,
  files?: FileNewInterface[];
}

interface FileNewInterface {
  field: string;
  filedId: string;
  id: string;
  customerId?: string;
  createdAt?: string;
  updatedAt?: string;
  file: FileDatabase;
}

export interface PayloadApproveAction {
  id: string;
  isApprove: boolean;
  reason?: string;
  filesVip?: string[]
}

export interface FileDatabase {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  path?: string;
}

export interface PayloadCreateActivity {
  customerId: string;
  meetingAt: string;
  meetingForm: string;
  mentionedProject: string;
  satisfactionRate: number;
  purchaseRate: number;
  workHistory: string;
  informationExchanged: string;
  feedback: string;
  description: string;
  proposedSolutions: string;
  otherSource: string;
}
export interface PayloadUpdateCustomer extends PayloadCreateCustomer {
  id?: string;
}

export interface PayloadSendApproveCustomer {
  customerId: string
  sendApprove: boolean
}

export interface PayloadAppraisalCustomer {
  id: string;
  isAppraisal: boolean;
  reason?: string;
}
