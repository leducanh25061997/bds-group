import { FilterParams, Pageable } from 'types';
import { RealEstateItem } from 'types/RealEstate';
import { PropertyType } from 'types/Property';
import {
  DataTypeRealEstate,
  TransactionRealEstate,
  EvidenceFlag,
  Status,
  Shape,
} from 'types/Enum';
import { StaffItemDetail } from 'app/pages/Staff/slice/types';

export interface KpiMissionState {
  missionAssignManager?: Pageable<MissionAssignedItem>;
  detailKpiMission?: MissionAssignedItem;
  realEstateManager?: Pageable<RealEstateItem>;
  statisticKpi?: StatisticKpiItem;
  detailStatisticKpi?: StatisticKpiItem;
  isLoading?: boolean;
  isLoadingDetaiilStatistic?: boolean;
}
export interface MissionAssignedItem {
  id: string;
  code: string;
  name: string;
  type: string;
  creator: StaffItemDetail;
  measurementTime: MeasurementTimeKpi;
  // unit: UnitKpiEnum;
  // performance: number;
  // quantity: number;
  kpiPerformance: KpiPerformance[];
  startTime: any;
  endTime: any;
  status: boolean;
  processingStatus: boolean;
  calculationDate: CalculationDateKpi[];
  dutyPerformers: dutyPerformers[];
  taskGiver?: StaffItemDetail;
  isEdited?: boolean;
}
export interface dutyPerformers {
  id: string;
  dutyPerformerId: string;
  parentId?: string;
  staffId: string;
}
export interface PayloadCreateKpiMission {
  name: string;
  type: TypeKpiEnum;
  // performance: number;
  // quantity: number;
  // unit: UnitKpiEnum;
  kpiPerformance: KpiPerformance[];
  measurementTime: MeasurementTimeKpi;
  startTime: string;
  endTime: string;
  calculationDate: CalculationDateKpi[];
  status: boolean;
  staffIds: string[];
}
export interface KpiPerformance {
  id?: string;
  performance: number;
  quantity: number;
  unit: UnitKpiEnum;
  kpiPerformanceId?: string;
}
export interface PayloadUpdateKpiMission {
  id: string;
  payload: PayloadCreateKpiMission;
}

export enum TypeKpiEnum {
  DATA = 'data',
  REVENUE = 'revenue',
}

export enum TransferTextTypeKpiEnum {
  data = 'Data',
  revenue = 'Doanh thu',
}

export enum UnitKpiEnum {
  POTENTIAL = 'POTENTIAL',
  INTERESTED = 'INTERESTED',
  DAILY = 'DAILY',
  LEADS = 'LEADS',
  PRODUCT = 'PRODUCT',
  MONEY = 'MONEY',
}
export enum TransferTextUnitKpiEnum {
  customer = 'Khách hàng',
  POTENTIAL = 'Khách hàng tiềm năng',
  INTERESTED = 'Khách hàng quan tâm',
  DAILY = 'Khách hàng phát sinh',
  LEADS = 'Leads',
  PRODUCT = 'Sản phẩm',
  MONEY = 'VNĐ',
}
export enum MeasurementTimeKpi {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER_YEAR = 'quarter_year',
}
export enum TransferTextMeasurementTimeKpi {
  day = 'Ngày',
  week = 'Tuần',
  month = 'Tháng',
  quarter_year = 'Quý',
}
export enum CalculationDateKpi {
  MON = 'mon',
  TUE = 'tue',
  WEB = 'web',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}

export enum TransferTextStatus {
  true = 'Kích hoạt',
  false = 'Vô hiệu',
}
export interface PayloadGetDetailKpiMission {
  id: string;
}
export interface RealEstateState {
  realEstateManager?: Pageable<RealEstateItem>;
  isLoading?: boolean;
  listPropertyViewsType?: PropertyType[];
  listPropertyFactorsType?: PropertyType[];
  listRealEstateProject?: PropertyType[];
  listRealEstateFrontageAdvantage?: PropertyType[];
  realEstateDetail?: RealEstateItem | null;
}

export interface PayloadCreateRealEstate {
  totalPrice: number | string;
  totalPriceUSD: number | string;
  fx: number;
  priceUSDPerLA: number | string;
  priceUSDPerGFA: number | string;
  sector: number;
  generalInfo: GeneralInfo;
  positionInfo: PositionInfo;
  statusInfo: StatusInfo;
  legalStatus: LegalStatus;
  additionalStatus: AdditionalStatus;
  estimatePrice: EstimatePrice;
  tenureType?: string;
  id?: string;
  appraisalId?: string;
}

export interface GeneralInfo {
  dataSrc: string;
  dataType: DataTypeRealEstate;
  transactionType: TransactionRealEstate;
  transactionTime: string;
  propertyCode: string | null;
  evidenceFlag: EvidenceFlag | null;
  projectId: number | null;
}

export interface PositionInfo {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  ward: string;
  street: string;
  location: string;
  apartmentNumber: string;
}

export interface StatusInfo {
  status: Status | null;
  area: number | string;
  width: number | null | string;
  length: number | null | string;
  currentArea: number | null | string;
  gfa: number | string;
  plotRatio: number | null | string;
  tenure?: number | null;
  shape: Shape | null;
  frontageAdvantage: number | null;
  views: number[];
  factors: number[];
  description: string;
}

export interface LegalStatus {
  constructionPermit: boolean;
  masterPlan1_500: boolean;
  masterPlan1_2000: boolean;
  inPrincipleApproval: boolean;
  llc_lgd: boolean;
  dc_ccc: boolean;
  spa: boolean;
  lurc: boolean;
  licenseFiles: number[];
}

export interface AdditionalStatus {
  units: number | null | string;
  netLandArea: number | null | string;
  curLandStatus: string;
  curLandStatus_RLR: number | null | string;
  curLandStatus_RHR: number | null | string;
  curLandStatus_Comercial: number | null | string;
  curLandStatus_Hospitality: number | null | string;
  curLandStatus_Industrial: number | null | string;
  curLandStatus_Agricultural: number | null | string;
  launchYear: number | null;
  renovateYear: number | null;
  completionYear: string | number;
  noBlock: number | null | string;
  noFloor: number | null | string;
  occupancy: number | null | string;
}

export interface EstimatePrice {
  lufs: number | null | string;
  capitalizationRate: number | null | string;
  seller: string;
  buyer: string;
  ppSquareOnNLA: number | null | string;
  irr: number | null | string;
  mgr: number | null | string;
  adr: number | null | string;
  marketYield: number | null | string;
  ppr: number | null | string;
  bank: string;
  bankInstrContactPerson: string;
  bankInstrPhone: string;
  bankInstrEmail: string;
  borrowerName: string;
  borrowerMail: string;
  borrowerPhone: string;
  instrDateTime: string;
  instrDate: string;
  instrTime: string;
}

export interface PayloadGetDetailRealEstate {
  id: string;
}

export interface PayloadUpdateStatusRealEstate {
  id: number | string;
  status: Status;
}

export interface AdditionalInfo {
  key: string;
  value: string;
}

export interface PayloadUpdateRealEstate extends PayloadCreateRealEstate {
  id?: string;
}

export interface PayloadGetStatisticKpi {
  id: string;
  params: FilterParams;
}

export interface StatisticKpiItem {
  header?: string[];
  data?: any[];
  statistic: {
    totalStaff?: {
      value?: number;
      increase?: number;
    };
    totalTicket?: {
      value?: number;
      increase?: number;
    };
    achieveTargets?: {
      value?: number;
      percent?: number;
      increase?: number;
    };
    failTargets?: {
      value?: number;
      percent?: number;
      increase?: number;
    };
  };
  kpi: MissionAssignedItem;
}
