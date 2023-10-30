import { TitleEnum } from './Enum';
import { Option } from './Option';

export interface ItemCustomerAccount {
  packageName: string;
  gameName: string;
  startTime: string;
  endTime: string;
  status: string;
  numberOfUser: number;
}

export interface ItemMainAccount {
  email: string;
  fullName: string;
  position: string;
  status: string;
}

export interface EnumObject {
  id: number;
  title: TitleEnum;
  ctlotusEnumValues: Option[];
}
