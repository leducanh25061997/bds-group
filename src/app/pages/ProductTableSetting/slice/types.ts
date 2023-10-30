import { FileWithPath } from 'react-dropzone';

import { ProductError } from '../components/UploadErrorDialog';

export interface BlockFields {
  block: string;
  dataFloor: string;
  dataQuanlityProduct: string;
}

export interface ProductTableOfProject {
  id: string;
  currentUploadedFile?: FileWithPath | null;
  uploadedProductTableList?: ApartmentList;
}
export interface ProductTableState {
  productTableData?: TableProductItem[] | null;
  isLoading?: boolean;
  currentUploadedFile?: FileWithPath | null;
  uploadedProductTableList: ApartmentList;

  uploadedProductTableProjectList: ProductTableOfProject[];
}

export interface PayloadGetProductTable {
  id: string;
}

export interface TableProductItem extends BlockFields {
  projectId: string;
}
export interface PayloadProductTable {
  id?: string;
  data: BlockFields[];
}
export interface PayloadDeleteProductIsCreated extends PayloadGetProductTable {}

export interface PayloadUploadProductTable {
  projectId: string;
  data: AdditionalProductItem[];
  showPrice: boolean;
}

export interface PayloadUploadGroundProductTable {
  projectId: string;
  formData: FormData;
}

export interface PayloadCheckFileUpload {
  id?: string;
  formData: FormData;
}

export interface ProductItem {
  id?: string;
  code: string;
  block: string;
  floor: string;
  position: string;
  type: string;
  status: string;
  bedRoom: string;
  area: string;
  direction: string;
  subscription: string;
  corner: string;
  carpetArea: string;
  builtUpArea: string;
  unitPrice: string;
  unitPriceVat: string;
  price: string;
  priceVat: string;
  codeOrgChart: string;
  showPrice?: boolean;
}

export interface AdditionalProductItem extends ProductItem {
  uuid?: string;
}

export interface PayloadCheckUploadedFileSuccess {
  id?: string;
  result: ApartmentList;
}

export interface PayloadGetProductOfProject {
  projectId: string;
}

export interface ApartmentList {
  data: {
    products: AdditionalProductItem[];
    duplicate: ProductItem[];
    error: ProductError[];
  };
}

export interface ProductOfProject {
  data: ProductItem[];
}
