import { OrgChart, User } from './User';

export interface StaffItem {
  createdAt: string;
  updatedAt: string;
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
  typeIdentification: string;
  identityNumber: any;
  dateRange: any;
  workingUnit: any;
  staffLevel: any;
  commission: number;
  user: User;
  orgChart: OrgChart;
  soical: any;
}
