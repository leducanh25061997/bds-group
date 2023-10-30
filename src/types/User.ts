import {
  AccountType,
  ApproveCustomerBigTypeEnum,
  CustomerEnum,
  CustomerGroupType,
  CustomerSourceType,
  CustomerType,
  SocialType,
  Status,
  TYPEIdentification,
  TransferTextStatus,
} from './Enum';
import {WorkFlow } from './Transaction';
export interface ComisstionItem {
  address: string;
  contracts: string[];
  dob: string;
  fullName: string;
  gender: 'FEMALE' | 'MALE';
  id: string | number;
  license: string;
  licenseImage: any;
  phone: string;
  staffCode: string;
  assumedRevenue?: number;
  typeAccount?: string;
  user: User;
  additionalFiles?: AdditionalFile[];
  propertyCode: string;
  projectCode: string;
  propertyName: string;
  projectName: string;
  propertyPrice: number;
  staffName: string;
  amountPaid: number;
  phaseName: number;
  paidDate: string;
}

export interface StaffTransaction {
  id: string;
  code: string;
  commission: number;
  createdAt: string;
  email: string;
  fullName: string;
  staffStatus: boolean;
  gender: string;
  address: string;
}

export interface UPloadComisstionDetail {
  createdAt: string;
  updatedAt: string;
  id: string;
  percent: number;
  value: number;
  totalPriceBroker: number;
  totalPrice: number;
  moneyReceived: number;
  moneyComing: number;
  moneyRemain: number;
  phase: number;
  isPaid: boolean;
  commission: Commission;
  supportCost: number;
  staff: Staff;
}

export interface Commission {
  updatedAt: string;
  id: string;
  productCode: string;
  status: string;
  revenue: number;
  value: number;
  percentReceive: number;
  paymentRate: number;
  phaseName: string;
  product: Product;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
  price: number;
  priceVat: number;
  area: number;
  status: string;
  imageUrl: any;
  project: Project;
}

export interface Project {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  investor: any;
  scale: any;
  area: any;
  form: string;
  ownershipForm: string;
  startPrice: any;
  endPrice: any;
  ratioCommission: any;
  isEsalekit: boolean;
  description: any;
  province: any;
  district: any;
  ward: any;
  address: any;
  fileId: any;
  image: Image;
  avatarEsalekit: string;
}

export interface Image {
  id: string;
  path: string;
}

export interface UPloadComisstion {
  createdAt: string;
  updatedAt: string;
  id: string;
  productCode: string;
  revenue: number;
  value: number;
  status: string;
  product: Product;
  phaseName: string;
  isPaid: boolean;
  customerName: string;
  paymentRate: number;
}

export interface Transaction {
  createdAt: string;
  updatedAt: string;
  id: string;
  customerName: any;
  customerEmail: any;
  customerPhone: any;
  amountPaid: number;
  phaseName: string;
  paidDate: string;
  isCalCommission: boolean;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
  price: number;
  priceVat: number;
  area: number;
  status: string;
  imageUrl: any;
  project: Project;
  transactions: Transaction[];
}

export interface Project {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
}

export interface ComisstionItemExcel {
  projectName: string;
  projectCode: string;
  staffName: string;
  total: string;
  status: boolean;
  treeData: ComisstionItem;
}
export interface AdditionalFile {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  code: string;
  birth: string;
  email: string;
  phoneNumber: string;
  gender: keyof typeof TransferTextStatus;
  typeIdentification: TYPEIdentification;
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  address: string;
  nationality: string;
  provinceBorn: string;
  districtBorn: string;
  wardBorn: string;
  streetBorn: string;
  addressBorn: string;
  note: string;
  status: CustomerEnum;
  source: CustomerSourceType;
  staffCode: string;
  finance: string;
  agree: string;
  evaluation: string;
  otherReason: string;
  staffName: string;
  socialApp: SocialType;
  projectName: string;
  groupType: CustomerGroupType;
  meetingAt: string;
  meetingForm: string;
  mentionedProject: string;
  satisfactionRate: number;
  purchaseRate: number;
  workHistory: string;
  informationExchanged: string;
  feedback: string;
  description: string;
  reason: string;
  proposedSolutions: string;
  staffEmail: string;
  otherSource: any;
  staff: Staff;
  createdAt: string;
  type: ProjectCustomerType;
  companyName?: string;
  companyCode?: string;
  companyDateRange?: string;
  companyIssuedBy?: string;
  position?: string;
  isMainCustomer?: boolean;
  subCustomerId?: string;
  activity?: Activity[];
  history?: any;
  isAppraisal?: boolean;
  files?: FileNewInterface[];
  filesVip?: FileNewInterface[];
  identifierType: TYPEIdentification;
  referralEmployeeCode?: string;
  referralEmployeeName?: string;
  sendApprove?: boolean;
  workFlow: WorkFlow;
  currentNodeId: string;
  customerBigApprove: CustomerBigApprove[]
  workFlowCustomerBigHistory: RecordApprovedTickets[]
}

export interface RecordApprovedTickets {
  createdAt: string;
  updatedAt: string;
  id: string;
  status: ApproveCustomerBigTypeEnum;
  nodeName: string;
  nodeId: string;
  reason: string | null;
  customerId: string;
  staffId: string;
  filesVip: FileDatabase[]
}

interface CustomerBigApprove {
  createdAt: string
  updatedAt: string
  id: string
  code: string
  customerId: string
  status: string
  nodeName: string
  currentNodeId: string
  canceledAt: any
  staffId: string
}

interface FileNewInterface {
  field: string;
  filedId: string;
  id: string;
  customerId?: string;
  createdAt?: string;
  updatedAt?: string;
  file: FileDatabase;
}

export interface FileDatabase {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  path?: string;
}

export interface Activity {
  createdAt: string;
  updatedAt: string;
  id: string;
  meetingAt: string;
  meetingForm: string;
  satisfactionRate: number;
  purchaseRate: number;
  workHistory: string;
  informationExchanged: string;
  feedback: string;
  description: string;
  proposedSolutions: string;
  note: string;
}
export enum ProjectCustomerType {
  PERSONAL = 'PERSIONAL',
  BUSINESS = 'COMPANY',
}
export interface User {
  avt: Avatar;
  createdAt: string;
  email: string;
  id: number | string;
  password: string;
  resetPasswordExpires: string;
  resetPasswordToken: string;
  status: Status;
  userRoles: userRoleType[];
  customer: Customer;
  supplier: Supplier;
  isFirstTime?: number;
  name?: string;
  roleId?: string;
  staffId?: string;
  isActive?: boolean;
  role: Roles;
  staff: Staff;
}

export interface Roles {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  key: string;
  permissionGroupId: string;
}

export interface Supplier {
  id: number;
  license: string;
  name: string;
  phone: string;
  taxCode: string;
  fax: string;
  address: string;
}

export interface Staff {
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: string;
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
  orgChart: OrgChart;
}

export interface OrgChart {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  name: string;
  xPath: string;
  manager: Manager;
}

export interface Manager {
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: string;
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

export interface Customer {
  id: string;
  address: string;
  businessName: string;
  dateOfIssue: string;
  dob: string;
  fax: string;
  identity: string;
  issuedAt: string;
  legalName: string;
  name: string;
  phone: string;
  position: string;
  representative: string;
  taxCode: string;
  type: CustomerType;
}

export interface Avatar {
  id: number;
  filename: string;
  mimetype: string;
  path: string;
}

export interface userRoleType {
  id: number;
  role: Role;
}

export interface Role {
  id: number;
  description: string;
  name: AccountType;
}

export interface Province {
  id: number;
  key: string;
  value: string;
}
export interface Options {
  label: string;
  value: string;
}
