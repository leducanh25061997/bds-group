import { Status } from './Enum';
export interface DataWorkDone {
  id: string;
  contract: string;
  value: number;
}

export interface PerformentContract {
  id: string;
  contractCode: string;
  name: string;
  createdAt: string;
  status: Status;
}

export interface RealValuation {
  id: string;
  realName: string;
  area: string;
  ctxd: string;
  purposeSd: string;
  valueTd: string;
  status: Status;
}

export interface Project {
  id: number;
  key: string;
  value: string;
  name?: string;
}

export interface ComisstionRules {
  name: string;
  sign: string;
  targetBegin: number;
  targetEnd: number;
  result: number;
}

export interface Beneficiary {
  name?: string;
  avatar?: string;
  persent: number;
  id?: string;
  isCheck?: boolean;
  position?: string;
  orgChartId?: string;
}

export interface ComisstionPolicy {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  projectId: string;
  orgChartNames: string;
  startDate: string;
  endDate: string;
  CheckStatus: boolean;
  needTarget: number;
  condition: number;
  percentReceive: number;
  code: string;
  totalCommission: number;
  commissionStaff: number;
  commissionManager: number;
  commissionBO: number;
  hotBonus: number;
  tax: number;
  supportCost: number;
  conditionType: string;
  project: ProjectLotus;
}

export interface ProjectLotus {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
}

export interface ListConditionApply {
  name: string;
  sign: string;
  target: number;
}

export interface CreateSalesUnit {
  orgChartId?: string;
  name?: string;
  staffPercent: number;
  totalPercentUnit: number;
  otherBenefitsPercents: OtherBenefitsPercent[];
}

export interface OtherBenefitsPercent {
  staffId?: string;
  percent: number;
  avatar?: string;
  staffName?: string;
  staffPosition?: string;
}

export interface CreateIndirectUnit {
  indirectUnitId?: string;
  name?: string;
  totalPercentUnit: number;
  indirectUnitPercents: IndirectUnitPercent[];
}

export interface IndirectUnitPercent {
  staffId?: string;
  percent: number;
  avatar?: string;
  staffName?: string;
  staffPosition?: string;
}

export interface ComissionPolicyDetail {
  id: string;
  code: string;
  name: string;
  projectId: string;
  orgChartNames: string;
  startDate: string;
  endDate: string;
  CheckStatus: boolean;
  totalCommission: number;
  commissionStaff: number;
  commissionManager: number;
  commissionBO: number;
  hotTranfer: number;
  hotBooking: number;
  tax: number;
  supportCost: number;
  conditionType: string;
  commissionPolicyStaffs: CommissionPolicyStaff[];
  conditionApply: ConditionApply;
  conditionPayments: ComisstionRules[];
  listIndirect: ListSale[];
  listSale: ListSale[];
}

export interface ListSale {
  key: string;
  orgChartId: string;
  listStaff: listStaff[];
}

export interface listStaff {
  createdAt: string;
  updatedAt: string;
  id: string;
  staffId: string;
  commissionPolicyId: string;
  typeCommissionPolicyStaff: string;
  percent: number;
  dependOrgChartId: any;
  staff: Staff;
  avatar: string;
}

export interface CommissionPolicyStaff {
  id: string;
  staffId: string;
  commissionPolicyId: string;
  typeCommissionPolicyStaff: string;
  percent: number;
  dependOrgChartId?: string;
  orgChartName: string;
  staff: Staff;
}

export interface Staff {
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

export interface ConditionApply {
  id: string;
  name: string;
  sign: string;
  target: number;
}
