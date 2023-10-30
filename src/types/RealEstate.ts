import {
  DataTypeRealEstate,
  TransactionRealEstate,
  EvidenceFlag,
  Status,
  Shape,
  PropertyType,
} from './Enum';

export interface RealEstateItem {
  id: string;
  total: number;
  property: Property;
  status: Status;
  realEstate: RealEstateInfo;
  createdBy: CreatedBy;
  createdByInfo: CreatedByInfo;
}

export interface CreatedByInfo {
  name: string;
}

export interface CreatedBy {
  fullName: string;
}

export interface RealEstateInfo {
  generalInfo: GeneralInfo;
  legalStatus: LegalStatus;
  positionInfo: PositionInfo;
  sector: Sector;
  statusInfo: StatusInfo;
  totalPrice: number;
  totalPriceUSD: number;
  fx: number;
  priceUSDPerLA: number;
  priceUSDPerGFA: number;
  id: number;
  additionalStatus: AdditionalStatus;
  estimatePrice: EstimatePrice;
}

export interface AdditionalStatus {
  id: number;
  units: number;
  netLandArea: number;
  curLandStatus: string;
  curLandStatus_RLR: number;
  curLandStatus_RHR: number;
  curLandStatus_Comercial: number;
  curLandStatus_Hospitality: number;
  curLandStatus_Industrial: number;
  curLandStatus_Agricultural: number;
  launchYear: number;
  renovateYear: number;
  completionYear: number | string;
  noBlock: number;
  noFloor: number;
  occupancy: number;
}

export interface EstimatePrice {
  id: number;
  lufs: number;
  capitalizationRate: number;
  seller: string;
  buyer: string;
  ppSquareOnNLA: number;
  irr: number;
  mgr: number;
  adr: number;
  marketYield: number;
  ppr: number;
  bank: string;
  bankInstrContactPerson: string;
  bankInstrPhone: string;
  bankInstrEmail: string;
  borrowerName: string;
  borrowerMail: string;
  borrowerPhone: string;
  instrDateTime: string;
}

export interface Sector {
  id: number;
  name: string;
  description: string;
  groups?: Group[];
}

export interface Group {
  id: number;
  name: string;
  description: string | null;
  fields: Field[];
}

export interface Field {
  id: number;
  name: string;
  description: string | null;
  type: string;
  ctlotusType: string | null;
  tableFieldKeys: TableFieldKeys[];
}

export interface TableFieldKeys {
  id: number;
  key: string;
  description: string | null;
  ctlotusType: CtlotusType;
}

export interface CtlotusType {
  id: number;
  name: string;
  description: string | null;
}

export interface GeneralInfo {
  dataSrc: string;
  dataType: DataTypeRealEstate;
  transactionType: TransactionRealEstate;
  transaction: string;
  transactionTime: string;
  evidenceFlag: EvidenceFlag;
  propertyCode: string;
  realEstateProject: RealEstateProject;
  purpose: string;
}

export interface RealEstateProject {
  id: number;
  name: string;
}

export interface PositionInfo {
  id: number;
  latitude: number;
  longitude: number;
  city: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  location: string;
  mapLocation: string;
  apartmentNumber: string;
  searchAddress: string;
}

export interface LegalStatus {
  id: number;
  constructionPermit: boolean;
  masterPlan1_500: boolean;
  masterPlan1_2000: boolean;
  inPrincipleApproval: boolean;
  llc_lgd: boolean;
  dc_ccc: boolean;
  spa: boolean;
  lurc: boolean;
  licenses?: LicenseFile[];
}

export interface LicenseFile {
  license?: any;
  id: number;
  file: File;
}

export interface File {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
}
export interface View {
  id: number;
  view: Info;
}

export interface StatusInfo {
  id: number;
  status: Status;
  area: number;
  constructionArea: number;
  width: number;
  length: number;
  currentArea: number;
  gfa: number;
  plotRatio: number;
  tenure?: number;
  nof: number;
  shape: Shape;
  realEstateViews: View[];
  realEstateFactors: Factor[];
  frontageAdvantage: FrontageAdvantage;
  note: string;
  description: string;
}

export interface FrontageAdvantage {
  id: number;
  name: string;
  description: string;
}

export interface Factor {
  id: number;
  factor: Info;
}

export interface Info {
  id: number;
  name: string;
  description: string;
}

export interface Property {
  type: PropertyType;
  total: number;
  createdAt: string;
  status: Status;
  id: string;
  realEstate?: RealEstateItem;
}

export interface PayloadGetDetailRealEstate {
  id: string;
}
