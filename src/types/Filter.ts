import {
  AccountType,
  CustomerType,
  TableType,
  ContractType,
  WorkFlowTypeEnum,
  SalesProgramStatusEnum,
} from './Enum';

export interface FilterParams {
  page?: number;
  limit?: number;
  sort?: string[];
  orderBy?: string[];
  searchKey?: string;
  search?: string;
  fields?: string[];
  endDate?: any;
  startDate?: any;
  fromDate?: any;
  toDate?: any;
  verificationStatusList?: string[];
  ids?: number[];
  accType?: string;
  status?: any;
  appraisalStatus?: string;
  type?: string | TableType | SalesProgramStatusEnum;
  customerType?: string | CustomerType;
  staffType?: string | AccountType;
  key?: string;
  province?: string;
  district?: string;
  provinceBorn?: string;
  districtBorn?: string;
  sortByName?: string;
  sectorId?: number | null;
  sector?: string | null;
  propertyType?: string | null;
  date?: any;
  createAt?: any;
  transactionTime?: any;
  months?: string;
  year?: string;
  contractType?: string | ContractType;
  byCurrentQuarter?: string;
  staffId?: string;
  id?: string;
  typeContract?: string | TableType;
  typeCategory?: string;
  checkStatus?: boolean;
  projectName?: string;
  workingUnit?: string;
  position?: string;
  workflowType?: WorkFlowTypeEnum;
  projectId?: string;
  isActive?: boolean;
  typeCard?: string;
  rangeDate?: string;
  orgChart?: string;
  groupType?: string;
  skipLoading?: boolean;
  isTransaction?: boolean;
  nodeName?: string;
  nameOrgchart?: string;
  orgChartId?: string;
  isSignUp?: boolean;
  staffName?: string;
  projectSettingId?: string;
  fileImportId?: string;
  segmentId?: string;
}

export interface GenerateCodes {
  generateCode: string;
}
