import { Pageable } from 'types';
import {
  PermisstionItem,
  RoleDetailItem,
  RoleItem,
  User,
} from 'types/Contract';
import { PropertyType } from 'types/Property';

export interface SettingState {
  permissionManager?: Pageable<PermisstionItem>;
  userManager?: Pageable<User>;
  isLoading?: boolean;
  rolesManager?: Pageable<RoleItem>;
  contractDetail?: PermisstionItem | null;
  listPropertyType?: PropertyType[];
  roleDetail?: RoleDetailItem;
}

export interface PayloadCreatePermission {
  name: string;
  permissionKeys: string[];
}
export interface PayloadGetDetailRoles {
  id: string;
}
export interface PayloadUpdateRoles {
  id?: string;
  name: string;
  permissionKeys: string[];
}

export interface PayloadUpdateUserRoles {
  roleId?: string;
  userIds: string[];
}
