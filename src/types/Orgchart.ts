import { PropertyType, Status } from './Enum';
import { CreatedByInfo, Field, Sector } from './RealEstate';

export interface OrgchartItem {
  id: string;
  code: string;
  name: string;
  xPath: string;
  parentOrgChart: parentOrgChart;
  manager: Manager;
  staffs: Staff[];
  countStaff: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  listOrgchartName: string;
}

export interface parentOrgChart {
  updatedAt: string;
  id: string;
  code: string;
  name: string;
  status: boolean;
  xPath: string;
}

export interface Staff {
  id: string;
  userId: string;
  staffStatus: boolean;
  fullName: string;
  birthDay: string;
  code: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  typeIdentification: string;
  identityNumber: any;
  dateRange: any;
  issuedBy: string;
  workingUnit: string;
  staffLevel: string;
  commission: number;
}

export interface Manager {
  id: string;
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

export interface OtherProperty {
  id: number | string;
  name: string;
  code: string;
  unit: string;
  originalValue: number;
  remainValue: number;
  remainValuePercent: number;
  isurance: string;
  usingUnit: string;
  brand: string;
  mfgYear: number;
  version: string;
  broughtDate: string;
  country: string;
  sector: Sector;
  fieldValues: FieldValue[];
}

export interface FieldValue {
  id: number;
  value: string | null;
  tableFieldValueTuples: TableFieldValueTuple[];
  field: Field;
}

export interface TableFieldValueTuple {
  id: number;
  tableFieldValues: TableFieldValue[];
}

export interface TableFieldValue {
  id: number;
  value: string;
  key: KeyType;
}

export interface KeyType {
  id: number;
  key: string;
  description: string | null;
}

export interface CreatedBy {
  id: number;
  email: string;
  createAt: string;
  password: string;
  status: Status;
  isFirstTime: number;
  resetPasswordToken: string;
  resetPasswordExpires: string;
  fullName: string;
}
