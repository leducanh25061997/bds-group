import { Pageable } from 'types';
import { PriorityStatus } from 'types/Enum';
import { ProjectItem } from 'types/Project';

export interface SalesProgramState {
  salesProgramManagement?: Pageable<SalesProgramItem> | null;
  isLoading?: boolean;
  productManagement?: ProductItem[] | null;
  detailSalesProgram?: SalesProgramItem | null;
  salesProgramPriorityManagement?: Pageable<SalesProgramItem> | null;
}

export interface ProductItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  block: string;
  code: string;
  price?: number;
  priceVat?: number;
  unitPrice?: number;
  unitPriceVat?: number;
  status: string;
  type: string;
  corner: string;
  floor: string;
}

export interface SalesProgramItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  productNumber: number;
  openSaleProducts: SalesProductsItem[];
  priorityStatus: PriorityStatus;
  isHiddenPrice: boolean;
  projectId: string;
  project?: ProjectItem;
  startEvent: string;
  endEvent: string;
  isDefault: boolean;
  isOpenSales: boolean;
  isPriority: boolean;
}

export interface SalesProductsItem {
  blockName: string;
  floor: string;
  products: string[];
}

export interface PayloadUpdateStatusSalesProgram {
  id?: string;
  status?: string;
}

export interface PayloadActionPriceSalesProgram {
  id?: string;
  isHiddenPrice?: boolean;
}

export interface PayloadSalesProgram {
  name: string;
  startDate: string;
  endDate: string;
  startEvent: string;
  endEvent: string;
  isDefault: boolean;
  projectId?: string;
  openSaleProducts: SalesProductsItem[];
}

export interface PayloadUpdateSalesProgram extends PayloadSalesProgram {
  id?: string;
}

export interface PayloadGetDetailSalesProgram {
  id?: string;
}

export interface PayloadSendNoti {
  settingSalesProgramId: string;
  orgChartId?: string;
  message: string;
}

export interface PayloadGetOrgtChart {
  id: string;
}

export interface FilterProduct {
  status?: string;
  block?: string;
  floor?: string;
  projectID?: string;
}
