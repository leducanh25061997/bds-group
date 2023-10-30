import { BankInfo, FilterParams, GenerateCodes, Pageable } from 'types';
import { serialize } from 'utils/helpers';

import { UploadFileItem } from 'app/pages/Comisstion/slice/types';
import {
  StatusTicketCanceled,
  StatusTicketDeposit,
  StatusTicketReservation,
} from 'app/pages/TransactionManagement/slice/type';

import { createService, downloadFileService } from './axios';
import dayjs from 'dayjs';

const instance = createService(process.env.REACT_APP_API_URL);
const instanceDownload = downloadFileService(process.env.REACT_APP_API_URL);

const uploadAvatar = async (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('files', file);
  try {
    const res = await instance.post(`/local-files/create-new-file`, formData);
    return res.data;
  } catch {
    return [];
  }
};

const uploadSingleFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);
  try {
    const res = await instance.post(`/local-files/upload`, formData);
    return res.data;
  } catch {
    return [];
  }
};

const uploadFilesPath = async (file: File[] | any[]) => {
  const formData = new FormData();
  for (let i = 0; i < file.length; i++) {
    formData.append('files', file[i]);
  }
  try {
    const res = await instance.post(`/local-files/upload`, formData);
    return res.data;
  } catch {
    return [];
  }
};

const uploadFile = async (file: File[] | any[]): Promise<number[]> => {
  const formData = new FormData();
  for (let i = 0; i < file.length; i++) {
    formData.append('files', file[i]);
  }
  try {
    const res = await instance.post(`/local-files/create-new-file`, formData);
    return res.data;
  } catch {
    return [];
  }
};

const uploadFileTemplates = async (file: File[] | any[]): Promise<string[]> => {
  const formData = new FormData();
  for (let i = 0; i < file.length; i++) {
    formData.append('files', file[i]);
  }
  try {
    const res = await instance.post(`/local-files/upload-templates`, formData);
    return res.data;
  } catch {
    return [];
  }
};

const getProvince = async (params: FilterParams): Promise<string[]> => {
  try {
    const res = await instance.get(
      `/province/get-province?${serialize(params)}`,
    );

    return res.data;
  } catch {
    return [];
  }
};

const getPerProvince = async (params: FilterParams): Promise<string[]> => {
  try {
    const res = await instance.get(
      `/province/get-province?${serialize(params)}`,
    );

    return res.data;
  } catch {
    return [];
  }
};

const postGenarateCode = async (params: GenerateCodes): Promise<string> => {
  console.log('postGenarateCode', params);
  try {
    const res = await instance.post(`/api/generatecode`, params);
    return res.data.generateCode;
  } catch {
    return '';
  }
};

const getContractPdf = async (id?: string): Promise<string[]> => {
  try {
    const res = await instance.get(`/contract/get-pdf/${id}`);
    return res.data;
  } catch {
    return [];
  }
};

const uploadFileTransaction = async (file: File): Promise<UploadFileItem[]> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheetName', 'TemplateGD');
  formData.append('Content-Type', 'multipart/form-data');
  formData.append('accept', '*/*');
  formData.append('firstRow', '3');
  formData.append(
    'type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );

  try {
    const res = await instance.post(`/api/transaction/import`, formData);
    return res.data?.data;
  } catch {
    return [];
  }
};

const uploadFileCustomer = async (
  file: File,
  isTransaction: boolean,
  sheetName: string,
  firstRow: number,
  isCompany: number,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheetName', sheetName);
  formData.append('Content-Type', 'multipart/form-data');
  formData.append('accept', '*/*');
  formData.append('firstRow', `${firstRow}`);
  formData.append('isTransaction', `${isTransaction}`);
  formData.append('isCompany', `${isCompany}`);
  formData.append(
    'type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  try {
    const res = await instance.post(`/api/customer/import`, formData);
    return res;
  } catch {
    return null;
  }
};

const uploadFileStaff = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheetName', 'TemplateStaff');
  formData.append('Content-Type', 'multipart/form-data');
  formData.append('accept', '*/*');
  formData.append('firstRow', '2');
  formData.append(
    'type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  try {
    const res = await instance.post(`/api/staff/import-data`, formData);
    return res;
  } catch {
    return null;
  }
};

const uploadFileLeads = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheetName', 'TemplateLead');
  formData.append('Content-Type', 'multipart/form-data');
  formData.append('accept', '*/*');
  formData.append('firstRow', '2');
  formData.append(
    'type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  try {
    const res = await instance.post(`/api/lead/import-excel`, formData);
    return res;
  } catch {
    return null;
  }
};

const uploadSimpleFile = async (file: File): Promise<number[]> => {
  const formData = new FormData();
  formData.append('files', file);
  try {
    const res = await instance.post(`/local-files/create-new`, formData);
    return res.data;
  } catch {
    return [];
  }
};

const updateStatusComisstion = async (params?: any) => {
  const res = await instance.post(`/api/commissiondetail/sendsms/${params}`);
  return res.data;
};

const downloadCustomerExcel = async (
  params: FilterParams,
  isTransaction: boolean,
) => {
  params.isTransaction = isTransaction;
  delete params.page;
  delete params.limit;
  try {
    const res: any = await instanceDownload.get(
      `/api/customer/export-excel?${serialize(params)}`,
    );
    const encodedUri = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DanhSachKH.xlsx');
    link.click();
    return true;
  } catch {
    return false;
  }
};

const downloadMembershipExcel = async () => {
  try {
    const res: any = await instanceDownload.get(
      `/api/code-generator/export-excel`,
    );
    const encodedUri = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DanhSachMaThe.xlsx');
    link.click();
    return true;
  } catch {
    return false;
  }
};

const downloadLeadExcel = async () => {
  let time_download = dayjs().format('DD-MM-YYYY-HH-mm-ss');
  try {
    const res: any = await instanceDownload.get(`/api/lead/export-excel`);
    const encodedUri = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DSLeads_${time_download}.xlsx`);
    link.click();
    return true;
  } catch {
    return false;
  }
};

const downloadTemplateCustomer = async () => {
  try {
    const res: any = await instanceDownload.get(
      `/api/customer/export-template`,
    );
    const encodedUri = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Template_KhachHang.xlsx`);
    link.click();
    return true;
  } catch {
    return false;
  }
};

const downloadCustomerMembershipExcel = async () => {
  try {
    const res: any = await instanceDownload.get(
      `/api/customer-citystar/export-excel`,
    );
    const encodedUri = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DanhSachKHMembership.xlsx');
    link.click();
    return true;
  } catch {
    return false;
  }
};

const uploadFileOrgchart = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheetName', 'TemplateOrgchart');
  formData.append('Content-Type', 'multipart/form-data');
  formData.append('accept', '*/*');
  formData.append('firstRow', '2');
  formData.append(
    'type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  try {
    const res = await instance.post(`/api/org-chart/import`, formData);
    return res;
  } catch {
    return null;
  }
};

const printTicket = async (
  id: string,
  printId: string,
  status?: StatusTicketReservation | StatusTicketDeposit | StatusTicketCanceled,
): Promise<{ url: string }> => {
  const res: any = await instance.get(`/api/ticket/print-ticket/${id}`, {
    params: {
      ...(status && { status }),
      ...{ printId },
    },
  });

  return res.data;
};

const printReceiptTicket = async (
  receiptId: string,
  printId: string,
  status?: StatusTicketReservation | StatusTicketDeposit | StatusTicketCanceled,
): Promise<{ url: string }> => {
  const res: any = await instance.get(
    `/api/receipt/print-receipt/${receiptId}`,
    {
      params: {
        ...(status && { status }),
        ...{ printId },
      },
    },
  );

  return res.data;
};

const getListBanks = async (): Promise<Pageable<BankInfo>> => {
  try {
    const res = await instance.get(`/api/bank`);
    return res.data;
  } catch {
    return { data: [], total: 0 };
  }
};

const getCountry = async (): Promise<string[]> => {
  try {
    const res = await instance.get(`/province/get-country`);

    return res.data;
  } catch {
    return [];
  }
};

export default {
  uploadAvatar,
  getProvince,
  getContractPdf,
  uploadFile,
  uploadSimpleFile,
  uploadFileTransaction,
  postGenarateCode,
  uploadFileCustomer,
  updateStatusComisstion,
  downloadCustomerExcel,
  uploadFileOrgchart,
  uploadFileStaff,
  uploadFilesPath,
  uploadFileLeads,
  uploadFileTemplates,
  printTicket,
  getListBanks,
  downloadMembershipExcel,
  downloadCustomerMembershipExcel,
  downloadLeadExcel,
  uploadSingleFile,
  printReceiptTicket,
  downloadTemplateCustomer,
  getPerProvince,
  getCountry,
};
