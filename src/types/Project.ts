import { ProductType } from "./Enum";

export interface ProjectItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  code: string;
  type: ProjectTypeEnum;
  status: ProjectStatusEnum;
  investor: string;
  scale: number;
  area: number;
  form: string;
  ownershipForm: string;
  startPrice: number;
  endPrice: number;
  ratioCommission: number;
  isEsalekit: boolean;
  description: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  fileId: string;
  image: Image;
  esalekit: Esalekit;
  classification: ProductType;
  avatarEsalekit: string
}
export interface Esalekit {
  id: string;
  leftTabs: any[];
}

export interface Image {
  id: string;
  path: string;
}

export enum ProjectTypeEnum {
  APARTMENT = 'APARTMENT',
  GROUND = 'GROUND',
  VILLA = 'VILLA',
  RESORT = 'RESORT',
  SHOP_HOUSE = 'SHOP_HOUSE',
  COMMERCIAL_AREA = 'COMMERCIAL_AREA',
}
export enum ProjectStatusEnum {
  ABOUT_TO_SALE = 'ABOUT_TO_SALE',
  ON_SALE = 'ON_SALE',
  HANDING_OVER = 'HANDING_OVER',
  HANDED_OVER = 'HANDED_OVER',
}
export enum ProjectFormEnum {
  SALE = 'SALE',
  LEASE = 'LEASE',
}
export enum ProjectOwnershipEnum {
  INDEFINITE = 'INDEFINITE',
  HAVE_TERM = 'HAVE_TERM',
}

export interface SignProductParams {
  projectId?: string;
  staffId: string;
  productId: string;
}
