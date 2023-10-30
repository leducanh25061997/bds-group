import { Pageable } from 'types';
import {
  ComisstionItem,
  UPloadComisstion,
  UPloadComisstionDetail,
} from 'types/User';
import { Gender, Status } from 'types/Enum';

export interface ComisstionState {
  ComisstionManagement?: Pageable<UPloadComisstion>;
  isLoading?: boolean;
  ComisstionDetail?: Pageable<UPloadComisstion>;
  roleList?: RoleData[];
  staffList?: Pageable<ComisstionItem>;
  manager1List?: Pageable<ComisstionItem>;
  manager2List?: Pageable<ComisstionItem>;
  workDone?: WorkDoneData;
}

export interface PayloadUpdateStatusComisstion {
  commissionDetailIds: string[];
}

export interface PayloadCreateComisstion {
  accTypeId: number;
  address: string;
  avt?: number;
  code: string;
  dob: string;
  email?: string;
  fullName: string;
  gender: Gender;
  license: string;
  licenseImage: number;
  password: string;
  phone: string;
  staffCode: string;
  typeAccount: string;
  avatar?: File;
  additionalFiles?: number[];
}
export interface PayloadUpdateComisstion extends PayloadCreateComisstion {
  id?: string;
  status: Status;
}

export interface PayloadGetDetailComisstion {
  id: string;
}

export interface PayloadGetTotalContractThisQuarter {
  id: string;
  byCurrentQuarter: boolean;
  fields: string;
}

export interface PayloadManagerment {
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
export interface WorkDoneData {
  Comisstion: number;
  totalProprtyValue: number;
  totalContract: number;
  totalContractThisQuarter: number;
  totalProperty: number;
}

export interface UploadFileItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  productCode: string;
  status: string;
  revenue: number;
  value: number;
  percentReceive: number;
  paymentRate: number;
  phaseName: string;
  customerName: string;
  customerPhone: string;
  commissionDetails: CommissionDetail[];
  product: Product;
}

export interface Transaction {
  createdAt: string;
  updatedAt: string;
  id: string;
  customerName: any;
  customerEmail: any;
  customerPhone: any;
  amountPaid: number;
  phaseName: string;
  paidDate: string;
  isCalCommission: boolean;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
  price: number;
  priceVat: number;
  area: number;
  status: string;
  imageUrl: any;
  project: Project;
  transactions: Transaction[];
}

export interface Project {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
}

export interface CommissionDetail {
  createdAt: string;
  updatedAt: string;
  id: string;
  percent: number;
  value: number;
  personalIncomeTax: number;
  totalPriceBroker: number;
  supportCost?: number;
  totalPrice: number;
  moneyReceived: number;
  moneyComing: number;
  moneyRemain: number;
  isPaid: boolean;
}
