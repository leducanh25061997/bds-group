export interface PermisstionItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  key: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  roleId: string;
  staffId: string;
}

export interface PermisstionItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  key: string;
  permissions: Permission[];
}
export interface RoleItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
}

export interface RoleDetailItem {
  id: string;
  name: string;
  permissions: Permission[];
  users: User[];
}

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  roleId: string;
  staffId: string;
  staff: Staff;
  avatar: string;
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
}

export interface Permission {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  key: string;
  permissionGroupId: string;
}
