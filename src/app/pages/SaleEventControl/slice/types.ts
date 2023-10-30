import { SalesProgramItem } from 'app/pages/SalesProgram/slice/types';
import { OrgChart } from 'types';
import { PhaseStatusEnum, PriorityStatusEnum } from 'types/Enum';
import { Product } from 'types/ProductTable';
import { ProjectItem } from 'types/Project';

export interface SaleEventControlState {
  eventSale?: EventSalesInfo | null;
  currentOrgChart?: OrgChart[];
  notifications?: Notifications;
  report: EventReport;
  permission?: EventPermission;
}

export interface EventSalesInfo {
  id: string;
  status: SaleControlEnum;
  isStart: boolean;
  salesProgramId: string;
  currentPhase: SaleControlEnum | null;
  currentPriority: SaleControlEnum | null;
  salesProgram: SalesProgramItem;
}

export interface EventReport {
  data: {
    product_not_transaction: number;
    product_inprogress_transaction: number;
    phase1_success: number;
    phase2_success: number;
    total_product: number;
    count_unit: number;
  };
}

export interface Notifications {
  data: Notification[];
  total: number;
}

export interface Notification {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  description: string;
  result: {
    id: string;
  };
  isRead: boolean;
  type: string;
  staffId: string;
  settingSalesProgramId: string;
}

export interface EventPermission {
  isAdmin: boolean;
  isSupport: boolean;
  salesUnit: {
    isManager: boolean;
    isStaff: boolean;
  };
}

export interface MovingProducts {
  priorityProducts: Product[];
  freeProducts: Product[];
}

export interface PayloadStartEvent {
  id: string;
  phase: string[];
}

export interface PayloadUpdatePhase {
  id: string;
  phase: SaleControlEnum;
}

export interface PayloadUpdatePriority {
  id: string;
  priority: SaleControlEnum;
}

export interface PayloadGetNotification {
  id: string;
}

export interface PayloadGetMovingProducts {
  id: string;
}

export interface PayloadMoveProducts {
  id: string;
  productIds: string[];
}

export interface PayloadEndEvent {
  id: string;
}

export interface PayloadGetReport {
  id: string;
}

export interface PayloadSendEmailEndPhase {
  id: string;
  currentPhase: SaleControlEnum;
}

export interface PayloadExportEventReport {
  id: string;
}

export interface PayloadCheckEventPermission {
  projectId: string;
  salesProgramId?: string;
}

export enum PhaseEnum {
  PHASE_1 = 'PHASE_1',
  PHASE_2 = 'PHASE_2',
}

export enum SaleControlEnum {
  START_PHASE1 = 'START_PHASE_1',
  END_PHASE1 = 'END_PHASE_1',
  START_PHASE2 = 'START_PHASE_2',
  END_PHASE2 = 'END_PHASE_2',

  START_PRIORITY1 = 'START_PRIORITY_1',
  END_PRIORITY1 = 'END_PRIORITY_1',
  START_PRIORITY2 = 'START_PRIORITY_2',
  END_PRIORITY2 = 'END_PRIORITY_2',
  START_PRIORITY3 = 'START_PRIORITY_3',
  END_PRIORITY3 = 'END_PRIORITY_3',

  NOT_START = 'NOT_START',
  STARTING = 'STARTING',
  ENDED = 'ENDED',

  SEND_EMAIL = 'SEND_EMAIL',
  EXPORT_EVENT_REPORT = 'EXPORT_EVENT_REPORT',

  MOVE_PRODUCT = 'MOVE_PRODUCT',
}
