/* eslint-disable prettier/prettier */
import { PermissionKeyEnum } from 'types/Permission';

export enum AccountType {
  Staff = 'Staff',
  Manager1 = 'Manager1',
  Manager2 = 'Manager2',
  Admin = 'Admin',
  Customer = 'Customer',
}

export enum CustomerType {
  PERSONAL = 'PERSONAL',
  COMPANY = 'COMPANY',
  BUSINESS = 'BUSINESS',
  SALES = 'SALES',
  INDIRECT = 'INDIRECT',
}

export enum CustomerSourceType {
  HOTLINE = 'HOTLINE',
  DATA = 'DATA',
  OTHER = 'OTHER',
  CBNV = 'CBNV',
}

export enum CustomerEvaluationBigType {
  HISTORY = 'Lịch sử mua BĐS (CTG, CĐT khác)',
  STOCK = 'KH là chủ DN niêm yết trên sàn chứng khoán',
  DOCTOR = 'Bác sĩ thẩm mỹ nổi tiếng',
  RELATIES = 'Người thân của Quan chức/Lãnh đạo Nhà nước',
  BDS = 'KH có sở hữu nhiều BĐS có giá trị trên 50 tỷ',
  AIRLINE = 'KH triệu dặm của các hãng Hàng Không',
  TRADEMARK = 'KH là chủ DN của các thương hiệu nổi tiếng',
  SHAREHOLDER = 'KH là cổ đông lớn của các Công ty niêm yết trên sàn chứng khoán (sở hữu >= 5% số lượng cổ phiếu)',
  VIP = 'KH VIP của các thương hiệu xa xỉ: đồng hồ, du thuyền, ô tô, trang sức, túi xách,…',
  VERYVIP = 'KH VERYVIP của các Tập Đoàn BĐS khác còn khả năng tài chính',
  STOCK30 = 'KH có tài khoản chứng khoán trị giá 30 tỷ trở lên',
  SAVINGS = 'KH có gửi tiền tiết kiệm trên 30 tỷ',
  OTHER = 'OTHER',
}

export enum TransferTextCustomerSourceType {
  HOTLINE = 'Đường dây nóng',
  DATA = 'Dữ liệu',
  OTHER = 'Khác',
  CBNV = 'CBNV',
}

export enum CustomerGroupType {
  POTENTIAL = 'POTENTIAL',
  INTERESTED = 'INTERESTED',
  DAILY = 'DAILY',
  BIG = 'BIG',
}

export enum CustomerTransactionType {
  PERSONAL = 'PERSONAL',
  COMPANY = 'COMPANY',
}

export enum SaleRulesType {
  THAN = 'THAN',
  THAN_OR_EQUAL = 'THAN_OR_EQUAL',
  BETWEEN = 'BETWEEN',
}

export enum ComissionStaffType {
  OTHER_BENEFITS = 'OTHER_BENEFITS',
  STAFF = 'STAFF',
  INDIRECT_UNIT = 'INDIRECT_UNIT',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VACANT_LAND = 'VACANT_LAND',
  OPERATING = 'OPERATING',
  SENT = 'SENT',
  REFUSE = 'REFUSE',
  NEW = 'NEW',
  DELETED = 'DELETED',
  CANCELED = 'CANCELED',
  LIQUID = 'LIQUID',
  LIQUIDATING = 'LIQUIDATING',
  LIQUIDATED = 'LIQUIDATED',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  EXPERTISE = 'EXPERTISE',
  PLANNING = 'PLANNING',
  REPORT = 'REPORT',
  SURVEY = 'SURVEY',
  COLLECT_INFO = 'COLLECT_INFO',
  VALUATION = 'VALUATION',
  APPRAISED = 'APPRAISED',
  APPROVED_TICKET = 'APPROVED_TICKET',
  USED = 'USED',
  NOTUSED = 'NOTUSED',
}

export enum TokenType {
  BEARER = 'Bearer',
}

export enum TransferTextStatus {
  All = 'Tất cả',
  ACTIVE = 'Kích hoạt',
  INACTIVE = 'Vô hiệu',
  NEW = 'Mới',
  SENT = 'Đang thương lượng',
  APPROVED = 'Đã phê duyệt',
  LIQUID = 'Đã thanh lý',
  EXPERTISE = 'Đang thẩm định',
  REFUSE = 'Đã từ chối',
  COMPANY = 'Doanh nghiệp',
  PERSONAL = 'Cá nhân',
  PERSIONAL = 'Cá nhân',
  CANCELED = 'Không thực hiện',
  LIQUIDATING = 'Đang thanh lý',
  LIQUIDATED = 'Thanh lý nghiệm thu',
  COMPLETED = 'Đã hoàn thành',
  DELETED = 'Đã xóa',
  Staff = 'Thẩm định viên',
  Manager1 = 'Nhân viên quản lý cấp 1',
  Manager2 = 'Nhân viên quản lý cấp 2',
  PLANNING = 'Lập kế hoạch',
  REPORT = 'Báo cáo',
  SURVEY = 'Khảo sát',
  COLLECT_INFO = 'Thu thập thông tin',
  VALUATION = 'Xác định giá trị',
  MALE = 'Nam',
  FEMALE = 'Nữ',
  NOTUSED = 'Chưa sử dụng',
  USED = 'Đã sử dụng',
}

export enum StatusUi {
  LOGIN = 'LOGIN',
  FORGOT = 'FORGOT',
  FORGOT_SUCCESS = 'FORGOT_SUCCESS',
  RESET_PASSWORD = 'RESET_PASSWORD',
  RESET_SUCCESS = 'RESET_SUCCESS',
}

export enum UpLoadFileStatus {
  EMPTY = 'EMPTY',
  SPENDING = 'SPENDING',
  SUCCESS = 'SUCCESS',
}

export enum TableType {
  MASTER = 'MASTER',
  RETAIL = 'RETAIL',
}

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}

export enum TYPEIdentification {
  IDENTITY_CARD = 'IDENTITY_CARD',
  CITIZEN_IDENTIFICATION = 'CITIZEN_IDENTIFICATION',
  PASSPORT = 'PASSPORT',
}

export enum DataTypeRealEstate {
  VALUATION = 'VALUATION',
  MARKET = 'MARKET',
}

export enum TransactionRealEstate {
  AP = 'AP',
  SP = 'SP',
}

export enum EvidenceFlag {
  SINGLE = 'SINGLE',
  PROJECT = 'PROJECT',
}

export enum Shape {
  SQUARE = 'SQUARE',
  DISPROPORTIONATE = 'DISPROPORTIONATE',
  L_SHAPE = 'L_SHAPE',
  TRIANGLE = 'TRIANGLE',
  TRAPEZIUM = 'TRAPEZIUM',
}

export enum PropertyType {
  REAL_ESTATE = 'REAL_ESTATE',
  OTHER = 'OTHER',
}

export enum TitleEnum {
  CustomerType = 'CustomerType',
  Gender = 'Gender',
  ContractType = 'ContractType',
  CurrencyUnit = 'CurrencyUnit',
  PaymentMethod = 'PaymentMethod',
  SendForm = 'SendForm',
  Language = 'Language',
  DataSourceType = 'DataSourceType',
  TransactionType = 'TransactionType',
  EvidenceFlag = 'EvidenceFlag',
  RealEstateLocation = 'RealEstateLocation',
  RealEsateActualStatus = 'RealEsateActualStatus',
  RealEstateShape = 'RealEstateShape',
  NoOfFrontages = 'NoOfFrontages',
  TenureType = 'TenureType',
  Role = 'Role',
  UserStatus = 'UserStatus',
  ContractStatus = 'ContractStatus',
  PropertyStatus = 'PropertyStatus',
  AppraisalPurpose = 'AppraisalPurpose',
  AppraisalBase = 'AppraisalBase',
  AppraisalMethod = 'AppraisalMethod',
  BriefDescriptionType = 'BriefDescriptionType',
  PrinceType = 'PrinceType',
  BriefDescriptionVehicleAccess = 'BriefDescriptionVehicleAccess',
  LegalContractLanguage = 'LegalContractLanguage',
  CompareLandEnum = 'CompareLandEnum',
  CompareBuildEnum = 'CompareBuildEnum',
  CompareAllEnum = 'CompareAllEnum',
  LandDescription = 'LandDescription',
  PermittedUse = 'PermittedUse',
  CategoryType = 'CategoryType',
}

export enum ContractType {
  SERVICE = 'SERVICE',
  ATTACH = 'ATTACH',
  LIQUID = 'LIQUID',
}
export enum ContractTypeView {
  SERVICE = 'SERVICE',
  ATTACHMENT = 'ATTACHMENT',
  LIQUIDATION = 'LIQUIDATION',
}

export enum StepValuation {
  STEP1 = 'PLANNING',
  STEP2 = 'COLLECT_INFORMATION',
  STEP3 = 'SURVEY',
  STEP4 = 'VALUE_CONFIRM',
  STEP5 = 'REPORT',
}

export enum TranferContractType {
  RETAIL = 'HĐ Khách lẻ',
  MASTER = 'HĐ Master',
}

export enum SignatureType {
  SIGNED_VALUER = 'signedValuer',
  SIGNED_OWNER = 'signedOwner',
  SIGNED_LAND_OFFICIALS = 'signedLandOfficials',
}

export enum NotifyType {
  ALL = 0,
  UNREAD = 1,
}

export enum StatusNotify {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export enum TenureType {
  TERM = 'TERM',
  LASTING = 'LASTING',
}

export enum TransactionStatusType {
  PAID = 'PAID',
  PAYING = 'PAYING',
  UNPAID = 'UNPAID',
}

export enum SocialType {
  FACEBOOK = 'FACEBOOK',
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM',
  SNAPCHAT = 'SNAPCHAT',
  TWITTER = 'TWITTER',
  GOOGLE = 'GOOGLE',
  ZALO = 'ZALO',
  WEBSITE = 'WEBSITE',
  OTHER = 'OTHER',
}

export enum EnjoymentType {
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
}

export enum StaffLevelType {
  C1 = 'C1',
  C2 = 'C2',
  D1 = 'D1',
  E1 = 'E1',
  E2 = 'E2',
  E3 = 'E3',
  M1 = 'M1',
  M2 = 'M2',
  M3 = 'M3',
}

export enum StaffFieldType {
  FRONT = 'FRONT',
  BACK = 'BACK',
  PORTRAIT = 'PORTRAIT',
}

export enum LeftTabType {
  DEFAULT = 'DEFAULT',
  ADD_NEW = 'ADD_NEW',
}

export enum LEFT_TAB {
  OVERVIEW = 'Tổng quan',
  GROUND = 'Mặt bằng',
  UTILITIES = 'Tiện ích',
  LIBRARIES = 'Thư viện',
  POLICY = 'Chính sách',
  NEWS = 'Tin tức',
  ADDNEW = 'Thêm menu',
}

export enum WorkFlowTypeEnum {
  RESERVATION = 'RESERVATION',
  DEPOSIT = 'DEPOSIT',
  CANCELED_TICKET = 'CANCELED_TICKET',
  CONTRACT = 'CONTRACT',
}
export enum WorkflowType {
  RESERVATION = 'Quy trình giữ chỗ',
  DEPOSIT = 'Quy trình đặt cọc',
  CANCELED_TICKET = 'Quy trình hủy chỗ, hoàn tiền',
  CONTRACT = 'Quy trình tạo hợp đồng',
  APPROVAL_CUSTOMER_BIG = 'Quy trình duyệt khách hàng lớn',
}

export enum ReceiptsStatus {
  CANCELED = 'CANCELED',
  APPROVED = 'APPROVED',
  WAITING = 'WAITING',
}

export enum RefundsStatus {
  CANCEL = 'CANCEL',
  APPROVED = 'APPROVED',
  WAITING = 'WAITING',
  CANCELED = 'CANCELED',
}

export enum CustomerEnum {
  POTENTIAL_CUSTOMER = 'POTENTIAL_CUSTOMER',
  TRANSACTION_CUSTOMER = 'TRANSACTION_CUSTOMER',
  PERSIONAL = 'PERSIONAL',
  COMPANY = 'COMPANY',
}

export enum CustomerTypeTitle {
  POTENTIAL_CUSTOMER = 'Khách hàng tiềm năng',
  TRANSACTION_CUSTOMER = 'TRANSACTION_CUSTOMER',
  PERSIONAL = 'Cá nhân',
  COMPANY = 'Doanh nghiệp',
}

export enum TypePayment {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  VISA = 'VISA',
  CDT = 'CDT',
  DVBH = 'DVBH',
}
export enum TypePaymentText {
  CASH = 'Tiền mặt',
  TRANSFER = 'Chuyển khoản',
  VISA = 'Thanh toán thẻ Visa',
  CDT = 'Đã thu CĐT',
  DVBH = 'Đã thu ĐVBH',
}
export enum ApplicableStatus {
  CREATE_TICKET = 'CREATE_TICKET',
  APPROVED_TICKET = 'APPROVED_TICKET',
  WAIT_APPROVE_TICKET = 'WAIT_APPROVE_TICKET',
  REFUSE_TICKET = 'REFUSE_TICKET',

  CREATE_DEPOSIT = 'CREATE_DEPOSIT',
  WAIT_APPROVE_DEPOSIT = 'WAIT_APPROVE_DEPOSIT',
  APPROVED_DEPOSIT = 'APPROVED_DEPOSIT',
  REFUSE_DEPOSIT = 'REFUSE_DEPOSIT',

  CREATE_CANCELED = 'CREATE_CANCELED',
  WAIT_APPROVE_CANCELED = 'WAIT_APPROVE_CANCELED',
  APPROVED_CANCELED = 'APPROVED_CANCELED',
  REFUSE_CANCELED = 'REFUSE_CANCELED',
}
export enum TransferTextApplicableStatus {
  CREATE_TICKET = 'Khởi tạo phiếu đặt chỗ',
  APPROVED_TICKET = 'Duyệt thành công phiếu đặt chỗ',
  WAIT_APPROVE_TICKET = 'Chờ duyệt phiếu đặt chỗ',
  REFUSE_TICKET = 'Từ chối phiếu đặt chỗ',

  CREATE_DEPOSIT = 'Khởi tạo phiếu đặt cọc',
  WAIT_APPROVE_DEPOSIT = 'Chờ duyệt phiếu đặt cọc',
  APPROVED_DEPOSIT = 'Duyệt thành công phiếu đặt cọc',
  REFUSE_DEPOSIT = 'Từ chối phiếu đặt cọc',

  CREATE_CANCELED = 'Khởi tạo phiếu hủy chỗ',
  WAIT_APPROVE_CANCELED = 'Chờ duyệt phiếu hủy chỗ',
  APPROVED_CANCELED = 'Duyệt thành công phiếu hủy chỗ',
  REFUSE_CANCELED = 'Từ chối phiếu hủy chỗ',
}
export enum ReceiptsType {
  RESERVATION = 'Phiếu giữ chỗ',
  DEPOSIT = 'Phiếu đặt cọc',
  CANCELED_TICKET = 'Phiếu hủy chỗ, hoàn tiền',
  CONTRACT = 'Phiếu tạo hợp đồng',
}

export enum StatusProductEnumEN {
  WARE_HOUSE = 'WARE_HOUSE',
  OPEN = 'OPEN',
  BOOKING = 'BOOKING',
  WAIT_FILE = 'WAIT_FILE',
  SOLD_OUT = 'SOLD_OUT',
  SIGN_UP = 'SIGN_UP',
  CONSTRACT = 'CONSTRACT',
  LIQUIDATION = 'LIQUIDATION',
  TRANSFER = 'TRANSFER',
  LOCK = 'LOCK',
  CLOSE = 'CLOSE',
}

export enum StatusProductCorlorEnum {
  WARE_HOUSE = '#C8CBCF',
  OPEN = '#FFEB99',
  BOOKING = '#7CE7FF',
  WAIT_FILE = '#FF9A6D',
  SOLD_OUT = '#FF595C',
  SIGN_UP = '#D687F2',
  CONSTRACT = '#F7ACD5',
  LIQUIDATION = '#34C759',
  TRANSFER = '#6BA7DF',
  LOCK = '#B5BAC0',
  CLOSE = '#FFFFFF',
}

export enum StatusProductEnum {
  WARE_HOUSE = 'Kho',
  CLOSE = 'Chưa mở bán',
  OPEN = 'Mở bán',
  BOOKING = 'Booking',
  WAIT_FILE = 'Chuyển cọc, chờ hồ sơ',
  SOLD_OUT = 'Đã bán',
  SIGN_UP = 'Đăng kí',
  CONSTRACT = 'Hợp đồng',
  LIQUIDATION = 'Thanh lý',
  TRANSFER = 'Chuyển nhượng',
  LOCK = 'Khoá',
}

export enum DialogProtype {
  REGISTER = 'REGISTER',
  LOCK_UP = 'LOCK_UP',
  RECALL = 'RECALL',
  TRANFER = 'TRANFER',
  UN_LOCK = 'UN_LOCK',
  OPEN_SELL = 'OPEN_SELL',
  CREATE_CONTRACT = 'CREATE_CONTRACT',
  TRANSACTION_NOTES = 'TRANSACTION_NOTES',
  BOOKING = 'BOOKING',
  WAIT_FILE = 'WAIT_FILE',
  LOCK = 'LOCK',
  RETURN = 'RETURN',
  PRODUCT_PRIORITY_ASSEMBLY = 'PRODUCT_PRIORITY_ASSEMBLY',
  ENTER_CUSTOMER_INFORMATION = 'ENTER_CUSTOMER_INFORMATION',
  TRANSFER_PRODUCT_TO_SALE_PROGRAM = 'TRANSFER_PRODUCT_TO_SALE_PRPGRAM',
  SEND_REQUIRE = 'SEND_REQUIRE',
  CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP',
}

export enum SalesProgramType {
  ENABLED = 'Còn hạn',
  DISABLED = 'Hết hạn',
}

export enum SalesProgramEnum {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum HOTLINE {
  NUMBERPHONE = '1900.9090',
}

export enum TypeCardEnum {
  SIVER = 'SIVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  PARTNER = 'PARTNER',
  AMBASSADOR = 'AMBASSADOR',
}

export enum PriorityAssemblyLock {
  PRIORITY_ASSEMBLY = 'PRIORITY_ASSEMBLY',
  LOCK_PRIORITY_ASSEMBLY = 'LOCK_PRIORITY_ASSEMBLY',
  PRIORITY_ADDITIONAL_ASSEMBLY = 'PRIORITY_ADDITIONAL_ASSEMBLY',
  ASSEMBLE_PRIORITY_SUPPLEMENT = 'ASSEMBLE_PRIORITY_SUPPLEMENT',
}

export enum DateEnum {
  Monday = 'Thứ 2',
  Tuesday = 'Thứ 3',
  Wednesday = 'Thứ 4',
  Thursday = 'Thứ 5',
  Friday = 'Thứ 6',
  Saturday = 'Thứ 7',
  Sunday = 'Chủ nhật',
}

export enum ProductType {
  LUXURY = 'LUXURY',
  STUDIO = 'STUDIO',
  APARTMENT = 'APARTMENT',
}

export enum TabMediaTypeEnum {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  VIEW3D = 'VIEW3D',
  VIEW360 = 'VIEW360',
  STREETVIEW = 'STREETVIEW',
  OVERALL_GROUND = 'OVERALL_GROUND',
  BANNER = 'BANNER',
  NEWS = 'NEWS',
  ESALEKIT_NEWS = 'ESALEKIT_NEWS',
}

export enum RefundEnum {
  WAITING = 'Chờ duyệt',
  APPROVED = 'Đã duyệt',
  CANCELED = 'Từ chối',
}

export enum PriorityStatus {
  NOT_OPENED_PRIORITY = 'NOT_OPENED_PRIORITY',
  OPEN_PRIORITY = 'OPEN_PRIORITY',
  LOCK_PRIORITY = 'LOCK_PRIORITY',
  LOCK_PRIORITY_ADDITIONAL = 'LOCK_PRIORITY_ADDITIONAL',
  OPEN_PRIORITY_ADDITIONAL = 'OPEN_PRIORITY_ADDITIONAL',
}

export enum SalesProgramStatusEnum {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum ColorPriority {
  WHITE = 'WHITE',
  RED = 'RED',
  BLUE = 'BLUE',
}

export enum PhaseStatusEnum {
  START_PHASE1 = 'START_PHASE_1',
  END_PHASE1 = 'END_PHASE_1',
  START_PHASE2 = 'START_PHASE_2',
  END_PHASE2 = 'END_PHASE_2',
}

export enum PhaseStatusEnumVN {
  START_PHASE_1 = 'Giao dịch giai đoạn 1',
  END_PHASE_1 = 'Kết thúc giao dịch giai đoạn 1',
  START_PHASE_2 = 'Giao dịch giai đoạn 2 ',
  END_PHASE_2 = 'Kết thúc giao dịch giai đoạn 2',
}

export const phase1Enum = [
  PhaseStatusEnum.START_PHASE1,
  PhaseStatusEnum.END_PHASE1,
];
export const phase2Enum = [
  PhaseStatusEnum.START_PHASE2,
  PhaseStatusEnum.END_PHASE2,
];

export enum PriorityStatusEnum {
  START_PRIORITY1 = 'START_PRIORITY_1',
  END_PRIORITY1 = 'END_PRIORITY_1',
  START_PRIORITY2 = 'START_PRIORITY_2',
  END_PRIORITY2 = 'END_PRIORITY_2',
  START_PRIORITY3 = 'START_PRIORITY_3',
  END_PRIORITY3 = 'END_PRIORITY_3',
}

export enum PriorityStatusEnumVN {
  START_PRIORITY_1 = 'Ưu tiên 1',
  END_PRIORITY_1 = 'Kết thúc ưu tiên 1',
  START_PRIORITY_2 = 'Ưu tiên 2',
  END_PRIORITY_2 = 'Kết thúc ưu tiên 2',
  START_PRIORITY_3 = 'Ưu tiên 3',
  END_PRIORITY_3 = 'Kết thúc ưu tiên 3',
}

export enum EventStatusEnum {
  NOT_START = 'NOT_START',
  STARTING = 'STARTING',
  ENDED = 'ENDED',
}

export enum CustomerProductStatusEnum {
  REQUEST = 'REQUEST',
  NONE = 'NONE',
  ACCEPT = 'ACCEPT',
  DONE = 'DONE',
  WAIT_FILE = 'WAIT_FILE',
}

export enum EventSocketListen {
  UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION',
  UPDATE_TICKET_RESERVATE = 'UPDATE_TICKET_RESERVATE',
  UPDATE_TICKET_DEPOSITE = 'UPDATE_TICKET_DEPOSITE',
  UPDATE_TICKET_CANCEL = 'UPDATE_TICKET_CANCEL',
  UPDATE_DATA_TABLE = 'UPDATE_DATA_TABLE',
  UPDATE_SALES_PROGRAM = 'UPDATE_SALES_PROGRAM',
}

export enum NotificationTypeEnum {
  KPI = 'kpi',
  SALES_EVENT = 'sales_event',
  RECEIPT = 'receipt',
  RESERVATION = 'reservation',
  CANCELED = 'canceled',
  DEPOSIT = 'deposit',
  REFUND = 'refund',
  CUSTOMER = 'customer_big',
}

export enum ApproveCustomerBigTypeEnum {
  CREATE = 'CREATE',
  WAIT_APPROVE = 'WAIT_APPROVE',
  APPROVED = 'APPROVED',
}

export enum PriorityScreening {
  FIRST_PRIORITY = 'FIRST_PRIORITY',
  SECOND_PRIORITY = 'SECOND_PRIORITY',
  THIRD_PRIORITY = 'THIRD_PRIORITY',
  WHITE_PRIORITY = 'WHITE_PRIORITY',
  PRIORITY_ADDITIONAL = 'PRIORITY_ADDITIONAL',
}

export enum StatusTakeCareEnum {
  NOT_CREEN = 'NOT_CREEN',
  UNALLOCATED = 'UNALLOCATED',
  NOT_RECEIVE = 'NOT_RECEIVE',
  TAKE_CARE = 'TAKE_CARE',
  LEAD_VITUAL = 'LEAD_VITUAL',
  LEAD_NOT_INTERESTED = 'LEAD_NOT_INTERESTED',
  LEAD_CAN_NOT_CONTACT = 'LEAD_CAN_NOT_CONTACT',
  LEAD_GOODWILL = 'LEAD_GOODWILL',
  LEAD_INTERESTED = 'LEAD_INTERESTED',
  LEAD_CONSULTED_DIRECTLY = 'LEAD_CONSULTED_DIRECTLY',
  LEAD_POTENTIAL = 'LEAD_POTENTIAL',
  LEAD_BIG = 'LEAD_BIG',
}

export const StatusTakeCare = [
  // {
  //   key: 'NOT_CREEN',
  //   name: 'Chưa sàng lọc',
  // },
  // {
  //   key: 'UNALLOCATED',
  //   name: 'Chưa phân bổ',
  // },
  // {
  //   key: 'NOT_RECEIVE',
  //   name: 'Chưa tiếp nhận',
  // },
  // {
  //   key: 'TAKE_CARE',
  //   name: 'Chăm sóc',
  // },
  {
    key: 'LEAD_VITUAL',
    name: 'Lead ảo',
  },
  {
    key: 'LEAD_NOT_INTERESTED',
    name: 'Lead không có nhu cầu',
  },
  {
    key: 'LEAD_CAN_NOT_CONTACT',
    name: 'Lead không liên lạc được',
  },
  {
    key: 'LEAD_GOODWILL',
    name: 'Lead thiện chí của dự án',
  },
  {
    key: 'LEAD_INTERESTED',
    name: 'Lead quan tâm BĐS',
  },
  {
    key: 'LEAD_CONSULTED_DIRECTLY',
    name: 'Lead đã tư vấn trực tiếp',
  },
  {
    key: 'LEAD_POTENTIAL',
    name: 'Lead tiềm năng',
  },
  {
    name: 'Lead KH lớn',
    key: 'LEAD_BIG',
  },
];
export enum ProductTicketTypeEnum {
  YES = 'YES',
  NO = 'NO',
}

export const PermissionsEventSale = [
  {
    key: PermissionKeyEnum.EVENT_SALES_OPEN,
    name: 'Mở bán hàng sự kiện',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_LIST_TRANSACTION,
    name: 'Danh sách giao dịch',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_REGISTER,
    name: 'Đăng ký',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_CONFIRM,
    name: 'ĐVBH Xác nhận',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_INFOR_CUSTOMER,
    name: 'Nhập thông tin khách hàng',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_RETURN,
    name: 'Trả về',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_REQUEST,
    name: 'Gửi yêu cầu',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_COMPLETED,
    name: 'Hoàn tất HS',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_ADD_PROFILE,
    name: 'Bổ sung HS',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_FORWARD_PRODUCT,
    name: 'Chuyển sản phẩm',
  },
  {
    key: PermissionKeyEnum.EVENT_SALES_REGAIN_PRODUCT,
    name: 'Thu hồi sản phẩm',
  },
];
