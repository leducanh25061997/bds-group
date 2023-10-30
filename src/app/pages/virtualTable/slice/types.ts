import { ProductDataTable, ProductTableParams, SettingTableProduct } from "types/ProductTable";

export interface VirtualTableState {
  settingTableProduct?: SettingTableProduct[];
  virtualDataTable?: ProductDataTable | null;
  filterParams?: ProductTableParams;
}

export enum ViewType {
  VIEW = 'VIEW',
  TABLE = 'TABLE'
}

export interface FilterParams extends ProductTableParams {
  block?: string;
}

export interface UpdateVirtualStatusParams {
  status: number;
  ids: string[];
}
