import { Gender, TYPEIdentification, TypeCardEnum } from './Enum';

export interface CityStarItem {
  id: string;
  name: string;
  birth: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  typeIdentification: TYPEIdentification;
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
  customerCode: string;
  qrCode: string;
  codeId: string;
  code: MembershipItem;
}

export interface MembershipItem {
  id: string;
  code: string;
  qrCode: string;
  linkDowloadQrCode: string;
  status: any;
  cardPrice: number;
  expiryDate: string;
  typeCard: TypeCardEnum;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customerCodeId: any;
}

export interface MembershipActive {
  id: string;
  code: string;
  qrCode: string;
  linkDowloadQrCode: string;
  status: any;
  cardPrice: number;
  expiryDate: string;
  typeCard: TypeCardEnum;
  customerCodeId: string;
  isActive: boolean;
  customer: CityStarItem;
}
