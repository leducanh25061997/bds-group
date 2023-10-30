import {
  EvidenceFlag,
  Status,
  Shape,
  PropertyType,
  TabMediaTypeEnum,
} from './Enum';
import { Project } from './User';

export interface EsalekitItem {
  id: string;
  project: Project;
  leftTabs: LeftTab[];
}

export interface LefttabItem {
  id: string;
  name: string;
  customType: boolean;
  type: string;
  mediaType: TabMediaTypeEnum;
  hearTabs: HeaderTab[];
}

export interface GalleryHeaderItem {
  id: string;
  title: string;
  url: string;
  thumbnail: any;
  type: TabMediaTypeEnum;
  isAvatar: boolean;
  createdAt: string;
  updateAt: string;
}

export interface LeftTab {
  id: string;
  name: string;
  type: string;
  customType: boolean;
  hearTabs: HeaderTab[];
}

export interface HeaderTab {
  id: string;
  name: string;
  html: any;
  data: any;
  type: string;
  mediaType: TabMediaTypeEnum;
}
export interface CreatedByInfo {
  name: string;
}

export interface CreatedBy {
  fullName: string;
}

export interface EsalekitInfo {
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
  transaction: string;
  transactionTime: string;
  evidenceFlag: EvidenceFlag;
  propertyCode: string;
  EsalekitProject: EsalekitProject;
  purpose: string;
}

export interface EsalekitProject {
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
  EsalekitViews: View[];
  EsalekitFactors: Factor[];
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
  Esalekit?: EsalekitItem;
}

export interface PayloadGetDetailEsalekit {
  id: string;
}

export interface OptionLeftTab {
  id: number;
  label: string;
  icon: string;
}
