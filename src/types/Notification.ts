import { StatusNotify } from './Enum';
import { Avatar } from './User';

export interface Notify {
  id?: string;
  createdAt?: string;
  isRead: boolean;
  // status?: StatusNotify;
  // notification?: Notification;
  // toUser?: ToUser;
  description?: string;
  name?: string;
  result?: ResultNoti;
  staffId?: string;
  type?: string;
  updateAt?: string;
  settingSalesProgramId?: string;
  sentTimes?: number;
}

export interface Notification {
  id?: string;
  title?: string;
  featureKey?: string;
  featureId?: string;
  description?: string;
  createdAt?: string;
  createdBy?: CreateBy;
}

export interface CreateBy {
  id?: number;
  avt?: Avatar;
  name?: string;
  role?: string;
}

export interface ToUser {
  id?: number;
  avt?: Avatar;
}

export interface ResultNoti {
  id?: string;
  projectId?: string;
  ticketId?: string;
  receiptId?: string;
  customerId?: string
}
