import { Pageable } from 'types';
import { OrgchartItem } from 'types/Orgchart';
import { PropertyType } from 'types/Property';
import { Status } from 'types/Enum';

import { StaffItem } from 'types/Staff';

import { TableHeaderProps } from '../../../../types/Table';

export interface OrgchartState {
  OrgchartManagement?: Pageable<OrgchartItem>;
  OrgchartManagementFilter?: Pageable<OrgchartItem>;
  isLoading?: boolean;
  OrgchartDetail?: OrgchartItem | null;
  StaffNoneOrgchart?: Pageable<StaffItem>;
  assetSector?: AssetSector;
  StaffOrgChart?: Pageable<StaffItem>;
}

export interface PayloadCreateOrgchart {
  name: string;
  parentOrgchartId: string;
  managerId: string;
  staffIds: string[];
}

export interface FieldValue {
  value?: string | null;
  fieldId?: number;
  tableFieldValueTuples?: TableFieldValueTuple[];
}

export interface TableFieldValueTuple {
  tableFieldValues: TableFieldValues[];
}
export interface TableFieldValues {
  [key: string]: string;
}

export interface PayloadGetDetailOrgchart {
  id: string;
}

export interface PayloadGetStaffOrgchart {
  orgChartId: string;
}

export interface PayloadUpdateStatusOrgchart {
  id: number | string;
}

export interface PayloadUpdateOrgchart extends PayloadCreateOrgchart {
  id?: string;
}

export interface PayloadAssetSectorId {
  id: number | string;
}

export interface AssetSector {
  id: number;
  name: string;
  description: string;
  groups: Group[];
}

export interface Group {
  id: number;
  name: string;
  description: string;
  fields: Field[];
}

export interface Field {
  id: number;
  name: string;
  description: string;
  fieldType: string;
  tableFieldKeys: TableFieldKey[];
}

export interface TableFieldKey extends TableHeaderProps {
  key: string;
  description?: string;
}

export interface StaffOption {
  name?: string;
  avatar?: string;
  id?: string;
  isCheck?: boolean;
  position?: string;
}
