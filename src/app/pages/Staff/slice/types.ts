import { Pageable, FilterParams, OrgChart } from 'types';
import { PropertyType, Status, TYPEIdentification } from 'types/Enum';
import { StaffItem } from 'types/Staff';
import { User } from 'types/User';

export interface StaffState {
  staffManagement?: Pageable<StaffItem>;
  staffDetail?: StaffItemDetail | null;
  isLoading?: boolean;
}
export interface PayloadGetStaff {
  staffId: string;
  params: FilterParams;
}

export interface PayloadGetDetailStaff {
  id: number | string;
  status: Status;
}
export interface PayloadGetListStaffInProject {
  projectId: string;
}

export interface StaffItemDetail {
  id: string;
  userId: string;
  staffStatus: boolean;
  fullName: string;
  code: string;
  email: string;
  birthDay: string;
  phone: string;
  position: string;
  gender: string;
  typeIdentification: TYPEIdentification;
  identityNumber: any;
  dateRange: any;
  workingUnit: any;
  issuedBy: string;
  staffLevel: any;
  commission: number;
  orgChart: OrgChart;
  files: FileId[];
  user: User,
  soical: any;
}

export interface PayloadCreateStaff {
  staffInfor: StaffInfor;
  fileIds: FileId[];
  social?: Social[];
}

export interface Social {
  type: string;
  link: string;
}

export interface PayloadUpdateStaff extends PayloadCreateStaff {
  id?: string;
}

export interface StaffInfor {
  fullName: string;
  code: string;
  phone: string;
  position: string;
  workingUnit: string;
  staffLevel: string;
  gender: string;
  typeIdentification: string;
  identityNumber: string;
  dateRange: string;
  email: string;
  orgChartCode: string;
  userId: string
}

export interface FileId {
  field: string;
  fileId: string;
  file?: File;
}

export interface File {
  id: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}
