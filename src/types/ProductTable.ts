import { OrgChart } from 'types';

import { ColorPriority, CustomerProductStatusEnum, StatusProductEnum } from './Enum';
import { ApplicableStatus, TypePayment, WorkFlowTypeEnum, ReceiptsStatus } from 'types/Enum';
import { ProjectTypeEnum } from 'types/Project';
import { EventSales, SalesProgram } from './Transaction';

export interface ChangeStatusPriorityParams {
  settingSalesProgramId: string;
  isOpen: boolean;
}

export interface DatatablePriorityParam {
  settingSalesProgramId: string;
}

export interface Product {
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
  updatedDate?: string;
  note?: string;
  unitPriceVat: number;
  unitPrice: number;
  projectId: string;
  customerProduct: CustomerProduct;
  signUpAt: string;
  project: Project;
  updatedAt: string;
  virtualStatus: StatusProductEnum;
}

export interface Project {
  projectSetting: ProjectSetting;
  projectSettingId: string;
}

interface ProjectSetting {
  registerTime: number
}

export interface CustomerProduct {
  id: string;
  typePayment: string;
  status: CustomerProductStatusEnum;
  taxCode: string;
  bank: string;
  numberAccount: string;
  amountOfMoney: string;
  tiket: Ticket;
  owner: Owner;
  staff: Staff;
}

export interface Owner {
  name: string;
}
export interface Ticket {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  depositCode: string;
  isPriority: boolean;
  status: ApplicableStatus;
  nodeName: string;
  currentNodeId: string;
  paymentCode: TypePayment;
  tax: string;
  bank: string;
  accountNumber: string;
  bankLoanNeeds: boolean;
  otherProjects: boolean;
  note: string;
  projectId: string;
  staffId: string;
  createdBy: string;
  productId: string;
  priorityId: string;
  receipts: Receipts[];
  staff: Staff;
}

export interface Receipts {
  createdAt: string;
  updatedAt: string;
  id: string;
  type: WorkFlowTypeEnum;
  status: ReceiptsStatus;
  code: string;
  note: string;
  totalPrice: number;
  amountPaid: number;
  bookingAmountReservation: number;
  contentPayment: string;
  createdDate: string;
  paymentDate: string;
  receivedDate: string;
  receivedTime: string;
  receiptNumber: string;
  reason: string;
  typePayment: string;
  customerId: string;
  ticketId: string;
}
export interface Priorities {
  id: string;
  order: number;
  productId: string;
  ticket: TicketApprove;
  ticketId: string;
  saleUnitName?: string;
  customerName?: string;
}

export interface TicketApprove {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  depositCode: string;
  status: string;
  nodeName: string;
  currentNodeId: string;
  paymentCode: string;
  payments: string;
  tax: string;
  bank: string;
  accountNumber: string;
  bankLoanNeeds: boolean;
  otherProjects: boolean;
  note: string;
  projectId: string;
  staffId: string;
  createdBy: string;
  productId: string;
  staff: Staff;
  user: User;
  customers: Customers[];
  isPriority: boolean;
}
interface Staff {
  createdAt: string;
  updatedAt: string;
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
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
  workingUnit: string;
  staffLevel: string;
  commission: number;
  orgChart: OrgChart;
}
interface User {
  createdAt: string;
  updatedAt: string;
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  roleId: string;
  staffId: string;
}

export interface Customers {
  id: string;
  mainCustomer: MainCustomer;
}

interface MainCustomer {
  address: string;
  birth: string;
  code: string;
  companyCode: string;
  companyDateRange: string;
  companyIssuedBy: string;
  companyName: string;
  createdAt: string;
  dateRange: string;
  description: string;
  district: string;
  email: string;
  feedback: string;
  gender: string;
  groupType: string;
  id: string;
  identityNumber: string;
  informationExchanged: string;
  issuedBy: string;
  meetingAt: string;
  meetingForm: string;
  mentionedProject: string;
  name: string;
  note: string;
  otherSource: string;
  phoneNumber: string;
  position: string;
  proposedSolutions: string;
  province: string;
  purchaseRate: string;
  satisfactionRate: string;
  socialApp: string;
  source: string;
  status: string;
  street: string;
  type: string;
  typeIdentification: string;
  updatedAt: string;
  ward: string;
  workHistory: string;
}

export interface ProductTableParams {
  idProject: string;
  orgChartId?: string;
  saleId?: string;
  code?: string;
  status?: string;
  block?: string;
  isPriority: boolean;
  priorityScreening?: string;
  isVirtual?: boolean;
}
export interface SettingTableProduct {
  block: string;
  dataFloor: string;
  dataQuanlityProduct: string;
  projectId: string;
  jsonGround: any;
}

export interface ProductDataTable {
  infProject: InfProject;
  data: DataProtype;
  countPriority: any;
  isSaleProgram: boolean;
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

interface DataProtype {
  [x: string]: Product[];
}
