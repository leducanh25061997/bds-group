import { ReactNode } from 'react';

export interface TableHeaderProps {
  id: string;
  label: ReactNode | string;
  align?: 'right' | 'left' | 'center' | 'inherit' | 'justify';
  icon?: any;
  isShow?: boolean;
  width?: number | string;
  hasSort?: boolean;
  disable?: boolean;
  style?: any;
  hasNotWrap?: boolean;
  left?: number;
  position?: string;
  background?: string;
  value?: any;
  checked?: boolean;
  subLable?: string;
  isSelect?: boolean;
  display?: string;
  isFixed?: boolean;
}

export interface ItemGameForTable {
  status: string;
  nameConfig: string;
  linkUrl: string;
  numberOfUser: number;
}

export type TableHeaderConfigurationPopup = TableHeaderProps[] | undefined;

export enum TypeCheckBoxTable {
  RADIO = 'Radio',
  CHECKBOX = 'Checkbox',
  DISABLE = 'DISABLE',
}
