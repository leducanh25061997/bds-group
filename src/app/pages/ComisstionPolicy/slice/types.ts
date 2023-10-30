import { Pageable } from 'types';
import { ComisstionItem } from 'types/User';
import { Gender, Status } from 'types/Enum';
import {
  ComissionPolicyDetail,
  ComisstionPolicy,
  ComisstionRules,
  CreateIndirectUnit,
  CreateSalesUnit,
  ListConditionApply,
} from 'types/Comisstion';

export interface ComisstionPolicyState {
  ComisstionManagement?: Pageable<ComisstionPolicy>;
  ComisstionManagementInactive?: Pageable<ComisstionPolicy>;
  isLoading?: boolean;
  ComisstionPolicyDetail?: ComissionPolicyDetail;
  roleList?: RoleData[];
  staffList?: Pageable<ComisstionItem>;
  manager1List?: Pageable<ComisstionItem>;
  manager2List?: Pageable<ComisstionItem>;
  managermentList?: ListManagementData[];
}

export interface PayloadUpdateStatusComisstion {
  id: number | string;
  status: Status;
}

// export interface PayloadUpdateComisstionPolicy extends PayloadCreateComisstionPolicy {
//   id?: string;
// }

export interface PayloadGetDetailComisstionPolicy {
  id: string;
}

export interface PayloadGetTotalContractThisQuarter {
  id: string;
  byCurrentQuarter: boolean;
  fields: string;
}

export interface PayloadListManagement {
  id: string;
}

export interface RoleData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  value: string | number;
  key: string;
}
export interface ListManagementData {
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: string;
  staffStatus: boolean;
  fullName: string;
  code: string;
  email: string;
  phone: string;
  position: any;
  gender: string;
  typeIdentification: string;
  identityNumber: any;
  dateRange: any;
  workingUnit: any;
  staffLevel: any;
  commission: number;
}

export interface PayloadCreateComisstionPolicy {
  commissionPolicyId?: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  projectId: string;
  totalCommission: number;
  commissionStaff: number;
  commissionManager: number;
  commissionBO: number;
  hotBonus: number;
  tax: number;
  checkStatus: boolean;
  supportCost: number;
  listConditionApply: ListConditionApply;
  conditionPayments: ComisstionRules[];
  createSalesUnits: CreateSalesUnit[];
  createIndirectUnits: CreateIndirectUnit[];
}
