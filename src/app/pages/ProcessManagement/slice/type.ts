import { Pageable } from 'types';

export interface ProcessManagementState {
  processManagement?: Pageable<ProcessItem>;
  WorkFlowDetail?: WorkFlowItem | null;
  isLoading?: boolean;
}

export interface ProcessItem {
  name: string;
  projectId: string;
  firstNodeCode: string;
  listCreateWorkFlow: ListCreateWorkFlow[];
}

export interface ListCreateWorkFlow {
  id?: string;
  code: string;
  nextStepCode: string;
  backStepCode: string;
  name: string;
  typeTimeOut: string;
  timeOut: number;
  staffIds: string[];
}

export interface PayloadCreateWorkFlow {
  name?: string;
  type?: string;
  firstNodeCode?: string;
  listCreateWorkFlow?: ListCreateWorkFlow[];
}

export interface WorkFlowItem {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  name?: string;
  type?: string;
  isAutoChangeStep?: boolean;
  firstNode?: string;
  workFlows: any[];
  isUsed?: boolean;
}

export interface NodeWorkFlow {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  code?: string;
  name?: string;
  typeTimeOut?: string;
  staffs: StaffItem[];
}

export interface StaffItem {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  userId?: string;
  staffStatus?: boolean;
  code?: string;
  email?: string;
  phone?: string;
  position?: string;
  gender?: string;
  typeIdentification?: string;
  identityNumber?: string;
  dateRange?: string;
  issuedBy?: string;
  workingUnit?: string;
  staffLevel?: string;
  fullName?: string;
}

export interface PayloadGetDetailWorkFlow {
  id: string;
}

export interface PayloadUpdateWorkFlow extends PayloadCreateWorkFlow {
  id?: string;
}
