import { Pageable } from 'types';
import { CustomerItem, Staff } from 'types/User';
import {
  CustomerGroupType,
  CustomerSourceType,
  CustomerType,
  SocialType,
  Status,
  TYPEIdentification,
} from 'types/Enum';

export interface LogImportCustomerState {
  isLoading?: boolean;
  dataLog?: Pageable<DataLogItem>;
}

export interface  DataLogItem {
  id: string;
  type: string;
  errors: string;
  staffId: string;
  path: string;
  createdAt: string;
  updateAt: string;
}
