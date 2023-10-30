import { Status } from 'types/Enum';

export interface DashboardsState {
  hasUpdateInfo: boolean;
}

export interface PayloadActionDashBoard {
  hasUpdateInfo: boolean;
}

export interface WorkProgressItem {
  id: string;
  name: string;
  address: string;
  realEstateType: string;
  contract: string;
  assignUser: string;
  status: Status;
}

export interface PotentialContractType {
  id: string;
  contractCode: string;
  name: string;
  nameCustomer: string;
  numberRealEstate: string;
  createAt: string;
}

export interface TopCustomerType {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  customerType: string;
  spendingTotal: string;
}
