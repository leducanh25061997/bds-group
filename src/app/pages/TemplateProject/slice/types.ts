import { Pageable } from 'types';
import { ApplicableStatus } from 'types/Enum';

export interface TemplateProjectManagementState {
  documentManagement?: Pageable<fileDocumentitem>;
  documentPrintDetail?: fileDocumentitem;
  templateEmailManagement?: Pageable<PayloadCreateTemplateEmailAndSms>;
  templateSMSManagement?: Pageable<PayloadCreateTemplateEmailAndSms>;
  listProviderSMS?: Pageable<ProviderSMS>;
  isLoading: Record<string, boolean>; //boolean;
}

export interface fileDocumentitem {
  id: string;
  fileId: string;
  image: ImageTemplate;
  createdAt: string;
  projectId: string;
  updateAt: string;
  applicableStatus: ApplicableStatus[];
}
export interface ImageTemplate {
  createAt: string;
  id: string;
  path: string;
  receiptId?: string;
  ticketId?: string;
  updateAt: string;
}
export interface templateEmailItem {
  id: string;
  type: string;
  title: string;
  content: string;
}
export interface templateSMSItem {
  id: string;
  type: string;
  content: string;
}
export interface ProviderSMS {
  createdAt: string;
  updateAt: string;
  id: string;
  name: string;
  urlApi?: string;
  method?: number;
  param?: string;
  header?: string;
  body?: string;
}
export interface PayloadCreateFileDocument {
  fileId: string | number;
  projectId: string;
  applicableStatus: ApplicableStatus[];
}
export interface PayloadGetDocumentPrintDetail {
  id: string;
}
export interface PayloadDeleteTemplateDocumentPrint
  extends PayloadGetDocumentPrintDetail {}
export interface PayloadUpdateFileDocument {
  id: string;
  payload: PayloadCreateFileDocument;
}

export interface PayloadCreateTemplateEmailAndSms {
  id?: string;
  projectId?: string;
  status?: TemplateStatusEnum;
  type?: TemplateTypeEnum;
  title?: string;
  content?: string;
  smsBranchNameId?: string;
  smsBranchName?: ProviderSMS;
}

export enum TemplateTypeEnum {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum TemplateStatusEnum {
  APPROVED_TICKET = 'APPROVED_TICKET',
  APPROVED_DEPOSIT = 'APPROVED_DEPOSIT',
  EVENT_SALE_SEND_MAIL_END_PHASE = 'EVENT_SALE_SEND_MAIL_END_PHASE',
}
