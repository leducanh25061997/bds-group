import {
  EventSales,
  SalesProgram,
} from 'app/pages/SaleEventTransaction/slice/types';
import {
  Customers,
  TicketApprove,
} from 'app/pages/TransactionManagement/slice/type';
import { Pageable } from 'types';
import {
  ColorPriority,
  CustomerProductStatusEnum,
  StatusProductEnum,
} from 'types/Enum';
import { OrgchartItem } from 'types/Orgchart';
import { CustomerProduct, Project } from 'types/ProductTable';
import { ProjectTypeEnum } from 'types/Project';

export interface ApartmentInformationState {
  apartmentInformation?: ApartmentInformation | null;
  settingTableProduct?: SettingTableProduct[];
  tableProductInformation?: TableProductInformation | null;
  selectedBlock?: SettingTableProduct;
  filterDatatable?: ApartmentInformationSParams;
  productInformation?: any | null;
  productCanOrderPrototype?: TableProductInformation[] | any[];
  OrgchartManagement?: Pageable<OrgchartItem>;
}
export interface UpdateStatusTableProductParams {
  ids: string[];
  status: number;
  settingSalesProgramId?: string;
  projectId?: string;
}

export interface ProductsCanOrderFilter {
  idProject: string;
  saleId?: string;
  productId?: string;
  block?: string;
  floor?: string;
}

export interface OpenPriorityAdditionalRequest {
  listProductAndOrgChart: ListProductAndOrgChart[];
}

export interface ListProductAndOrgChart {
  productId: string;
  orgChartId: string;
}

export interface TableProductInformation {
  area: number;
  bedRoom: number;
  block: string;
  builtUpArea: number;
  carpetArea: number;
  code: string;
  floor: string;
  id: string;
  imageUrl: string;
  isLock: boolean;
  orgChart: OrgChart;
  position: string;
  status: StatusProductEnum;
  subscription: string;
  transactions: any[];
  type: string;
  price: number;
  priceVat: number;
  unitPrice: number;
  unitPriceVat: number;
  note: string;
  subcription: string;
  direction: string;
  priorities?: Priorities[];
  customerProduct: CustomerProduct;
  project: Project;
  signUpAt: string;
  projectId: string;
  corner: string;
}

export interface OrgChart {
  code: string;
  createdAt: string;
  id: string;
  name: string;
  status: boolean;
  updatedAt: string;
  xPath: string;
}

export interface ApartmentInformation {
  infProject: InfProject;
  data: DataProtype;
  countPriority: any;
  isSaleProgram: boolean;
}

interface DataProtype {
  [x: string]: SubDataProtype[];
}

export interface SubDataProtype {
  area: number;
  bedRoom: number;
  block: string;
  builtUpArea: number;
  carpetArea: number;
  code: string;
  corner: string;
  floor: string;
  id: string;
  imageUrl: string;
  isLock: boolean;
  position: string;
  price: number;
  priceVat: number;
  status: StatusProductEnum;
  subscription: string;
  orgChart: OrgChart;
  priorities?: Priorities[];
  colorPriority?: ColorPriority;
  view: string;
  showPrice: boolean;
  subcription: string;
  direction: string;
  canSetPriority: boolean;
  isPriorityAdditional?: boolean;
  customerProduct: CustomerProduct;
  unitPrice: number;
  unitPriceVat: number;
}

export interface Priorities {
  id: string;
  order: number;
  productId: string;
  ticket: TicketApprove;
  ticketId: string;
}

export interface Ticket {
  bank: string;
  accountNumber: string;
  bankLoanNeeds: string;
  code: string;
  createdBy: string;
  currentNodeId: string;
  customers: Customers;
  depositCode: string;
  id: string;
  nodeName: string;
  note: string;
  otherProjects: string;
  paymentCode: string;
  payments: string;
  productId: string;
  projectId: string;
  staffId: string;
  status: string;
  tax: string;
}
interface InfProject {
  address: string;
  count: Count[];
  area: number;
  code: string;
  description: string;
  district: string;
  endPrice: number;
  fileId: string;
  form: string;
  id: string;
  investor: string;
  isEsalekit: boolean;
  name: string;
  ownershipForm: string;
  projectSettingId: string;
  province: string;
  ratioCommission: number;
  scale: number;
  startPrice: number;
  status: string;
  type: ProjectTypeEnum;
  ward: string;
  isPriority: boolean;
  eventSales: EventSales;
  settingSalesProgram: SalesProgram;
}

export interface Count {
  color: string;
  key: string;
  name: string;
  value: string;
}
export interface ApartmentInformationSParams {
  idProject: string;
  orgChartId?: string;
  saleId?: string;
  code?: string;
  status?: string;
  block?: string;
  isPriority: boolean;
  priorityScreening?: string;
}

export interface SettingTableProductProtype {
  [x: string]: SettingTableProduct[];
}

export interface SettingTableProduct {
  block: string;
  dataFloor: string;
  dataQuanlityProduct: string;
  projectId: string;
  jsonGround: any;
}

export interface ChangeOrgChartProductRequest {
  ids: string[];
  orgChartId?: string;
  settingSalesProgramId?: string;
}

export interface UpdateNoteParams {
  id: string;
  note: string;
}

export interface MoveProductToSaleProgramParams {
  id?: string;
  productIds: string[];
}

export interface UpdateStatusProductCustomerParams {
  id: string;
  status: CustomerProductStatusEnum;
}
