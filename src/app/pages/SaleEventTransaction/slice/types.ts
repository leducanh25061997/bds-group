import { PhaseEnum } from 'app/pages/SaleEventControl/slice/types';
import {
  PriorityStatus,
  StatusProductEnumEN,
  StatusProductEnum,
  EventStatusEnum,
  PhaseStatusEnum,
} from 'types/Enum';
import { Product } from 'types/ProductTable';

export interface SaleEventTransactionState {
  saleEventTransaction?: SaleEventTransactionProtype | null;
  saleEventTransactionFree?: SaleEventTransactionProtype | null;
  saleEventTransactionPriority?: SaleEventTransactionProtype | null;
  loadingHeader: string;
  isLoadingPriority: boolean;
  isLoadingFree: boolean;
  searchKey?: string;
  permissionEventSale?: PermissionEventSaleProtype;
}

export interface SaleEventTransactionProtype {
  data: Product[];
  eventSales: EventSales;
  statistics: Statistics[];
}

export interface Statistics {
  color: 'string';
  key: StatusProductEnumEN;
  name: StatusProductEnum;
  value: number;
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

export interface TransactionParams {
  id: string;
  isPriority: boolean;
  search?: string;
  phase?: string;
  refreshPharse?: string;
  skipLoading?: boolean;
}

export interface CompleteProfileForm {
  id: string;
  productId: string;
}

export interface CheckPermissionEventSaleParams {
  projectId: string;
  salesProgramId: string;
}

export interface PermissionEventSaleProtype {
  isSupport: boolean;
  isAdmin: boolean;
  salesUnit: SalesUnit;
}

interface SalesUnit {
  isManager: boolean;
  isStaff: boolean;
}
