import { Pageable } from 'types';
import { Notify } from 'types/Notification';

export interface NotifyState {
  notificationsList?: Pageable<Notify>;
  isLoading?: boolean;
  hasUnread?: boolean;
  totalUnread?: number;
}

export interface PayloadReadedNotify {
  id?: string;
}
