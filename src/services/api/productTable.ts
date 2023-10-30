import {
  PayloadDeleteProductIsCreated,
  PayloadGetProductOfProject,
  PayloadGetProductTable,
  PayloadProductTable,
  PayloadUploadGroundProductTable,
  PayloadUploadProductTable,
  ProductOfProject,
} from 'app/pages/ProductTableSetting/slice/types';
import {
  OpenPriorityAdditionalRequest,
  ProductsCanOrderFilter,
  SettingTableProductProtype,
} from 'app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types';
import {
  CanceledRequest,
  OrderTicketRequest,
  TicketApprove,
  OpenPriorityAdditional,
  PayloadGetListConfirmTicket,
  PrintTicketItem,
} from 'app/pages/TransactionManagement/slice/type';
import {
  ChangeStatusPriorityParams,
  DatatablePriorityParam,
} from 'types/ProductTable';
import { serialize } from 'utils/helpers';

import { createService } from './axios';

const instance = createService(process.env.REACT_APP_API_URL);

const createProductTable = async (params: PayloadProductTable) => {
  const projectId = params.id;

  delete params?.id;

  const res = await instance.post(
    `/api/setting-table-product/${projectId}`,
    params,
  );

  return res.data;
};

// const updateProductTable = async (params: PayloadProductTable) => {
//   const projectId = params.id;

//   delete params?.id;

//   const res = await instance.patch(
//     `/api/setting-table-product/${projectId}`,
//     params,
//   );

//   return res.data;
// };

const getProjectProductTable = async (params: PayloadGetProductTable) => {
  const res = await instance.get(`/api/setting-table-product/${params.id}`);

  return res.data;
};

const checkFileUpload = async (params: FormData) => {
  const res = await instance.post(`/api/product/check-excel`, params);

  return res.data;
};

const uploadProductTable = async (params: PayloadUploadProductTable) => {
  const res = await instance.post(`/api/product/import/`, params);

  return res.data;
};

const deleteProductIsCreated = async (
  params: PayloadDeleteProductIsCreated,
) => {
  const res = await instance.post(`/api/project/${params.id}`, params.id);

  return res.data;
};

const createGroundProductTable = async (
  params: PayloadUploadGroundProductTable,
) => {
  const res = await instance.post(
    `/api/setting-table-product/ground/${params.projectId}`,
    params.formData,
  );
  return res.data;
};

const getGroundProductTable = async (params: PayloadGetProductTable) => {
  const res = await instance.get(
    `/api/setting-table-product/ground/${params.id}`,
  );

  return res.data;
};

const changeStatusPriority = async (params: ChangeStatusPriorityParams) => {
  const res = await instance.post(
    `/api/setting-sales-program/open-or-lock-priority`,
    params,
  );

  return res.data;
};

const fetchDatatableProirity = async (
  params: DatatablePriorityParam,
): Promise<SettingTableProductProtype> => {
  const res = await instance.get(
    `/api/product/data-table-priority?${serialize(params)}`,
  );

  return res.data;
};

const fetchTicketApprove = async (id: string): Promise<TicketApprove[]> => {
  const params = {
    projectId: id,
  };
  const res = await instance.get(
    `/api/ticket/list-ticket-approve?${serialize(params)}`,
  );

  return res.data.data;
};

const fetchTicketCanOrder = async (id: string): Promise<TicketApprove[]> => {
  const params = {
    projectId: id,
  };
  const res = await instance.get(
    `/api/ticket/list-ticket-order?${serialize(params)}`,
  );

  return res.data.data;
};

const createOrderTicket = async (params: OrderTicketRequest) => {
  const res = await instance.post(`/api/ticket/order-ticket`, params);
  return res.data;
};

const openPriorityAdditional = async (params: OpenPriorityAdditional) => {
  const res = await instance.post(
    `/api/setting-sales-program/open-priority-additional`,
    params,
  );
  return res.data;
};

const fetchProductInformation = async (params: string): Promise<any> => {
  const res = await instance.get(`/api/product/${params}`);
  return res.data;
};

const doCanceledReservation = async (params: CanceledRequest) => {
  const res = await instance.post(`/api/ticket/canceled-ticket`, params);
  return res.data;
};

const productCanOrder = async (
  params: ProductsCanOrderFilter,
): Promise<any> => {
  const res = await instance.get(
    `/api/product/products-can-order?${serialize(params)}`,
  );
  return res.data.data;
};

const postOpenPriorityAdditional = async (
  params: OpenPriorityAdditionalRequest,
) => {
  const res = await instance.post(
    `/api/setting-sales-program/open-priority-additional`,
    params,
  );
  return res.data;
};

const getProductOfProject = async (
  params: PayloadGetProductOfProject,
): Promise<ProductOfProject> => {
  const res = await instance.get(`/api/product/product-of-project`, { params });

  return res.data;
};

const getListPrintTicket = async (
  params: PayloadGetListConfirmTicket,
): Promise<PrintTicketItem[]> => {
  const res = await instance.get(`/api/print/list-print`, { params });

  return res.data;
};

export default {
  createProductTable,
  getProjectProductTable,
  uploadProductTable,
  checkFileUpload,
  deleteProductIsCreated,
  createGroundProductTable,
  getGroundProductTable,
  changeStatusPriority,
  fetchDatatableProirity,
  fetchTicketApprove,
  createOrderTicket,
  doCanceledReservation,
  openPriorityAdditional,
  fetchProductInformation,
  productCanOrder,
  postOpenPriorityAdditional,
  fetchTicketCanOrder,
  getProductOfProject,
  getListPrintTicket
};
