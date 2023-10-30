import { Pageable } from 'types';
import { CityStarItem, MembershipActive, MembershipItem } from 'types/CityStar';
import { TYPEIdentification, TypeCardEnum } from 'types/Enum';

export interface CityStarState {
  CityStarManagement?: Pageable<MembershipItem>;
  CustomerCityStarManagement?: Pageable<CityStarItem>;
  isLoading?: boolean;
  membershipDetail?: CityStarItem | null;
  membershipActiveDetail?: MembershipActive | null;
}

export interface PayloadGetDetailCityStar {
  id: string;
}
export interface PayloadCheckExistCode {
  customerCode?: string;
}

export interface PayloadPostCodeGenerate {
  count: number;
  typeCard: TypeCardEnum
}

export interface PayloadActiveMembership {
  name: string;
  customerCode?: string;
  birth: string;
  email: string;
  phoneNumber: string;
  gender: string;
  typeIdentification: TYPEIdentification;
  identityNumber: string;
  dateRange: string;
  issuedBy: string;
}

export interface PayloadMembershipSuccess {
  success: boolean
  data: MembershipItem
}



