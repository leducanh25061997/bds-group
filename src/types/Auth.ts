import { TokenType } from './Enum';

export interface AuthParams {
  email: string;
  password: string;
}

export interface UpdatePassword {
  newPassword: string;
  confirmPassword: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  data: DataAuthResponse;
  message: string;
}
export interface DataAuthResponse {
  access_token: string;
  token_type: TokenType.BEARER;
  user_info: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  roleId: string;
  staffId: string;
  role: Role;
  staff: Staff;
  avatar: string;
}

export interface Role {
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

export interface Staff {
  id: string;
  userId: string;
  staffStatus: boolean;
  fullName: string;
  code: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  typeIdentification: string;
  identityNumber: any;
  dateRange: any;
  workingUnit: any;
  staffLevel: any;
  commission: number;
  orgChart: OrgChart;
  files: FileId[];
  soical: any;
}

export interface FileId {
  field: string;
  fileId: string;
  file?: File;
}

export interface OrgChart {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  name: string;
  status: boolean;
  xPath: string;
  manager: Manager;
}

export interface Manager {
  id: string;
  userId: string;
  staffStatus: boolean;
  fullName: string;
  code: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  typeIdentification: string;
  identityNumber: any;
  dateRange: any;
  workingUnit: any;
  staffLevel: any;
  commission: number;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPassParams {
  staffId?: string
}

export interface ForgotParams {
  newPassword: string;
  confirmPassword: string;
}

export interface ItemProject {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
}
export enum RoleNameUser {
  SYSADMIN = 'sysadmin',
  IT_SUPORT = 'IT-support',
  EXPERT = 'Chuyên viên',
  WING_ADMIN = 'Admin cánh quân',
  MANAGE = 'Quản lý',
  ACCOUNTANT = 'Kế Toán',
  INTERNAL_ADMINISTRATION = 'Quản trị nội bộ',
}

export interface PayloadUpdateAvatarUser {
  avatar?: string;
}
