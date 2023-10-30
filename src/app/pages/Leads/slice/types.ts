import { Pageable } from "types";

export interface LeadState {
  leadManager?: Pageable<LeadItem>;
  leadManagerTrans?: Pageable<LeadItem>;
  leadManagerAlloted?: Pageable<LeadItem>;
  leadTakeCare?:  Pageable<LeadItem>;
  isLoading?: boolean;
  leadDetail?: LeadItem | null;
  Segment?: Segment[] | []
  fileImport?: FileImport[] | []
}


export interface FinancesStaff {
  id: string;
  fullName: string;
  staffCode: string;
  email: string;
  typeAccount: string;
  assumedRevenue: string;
}

export interface FileImport {
  id: string;
  fileName: string;
  path: string;
  userId: string;
}
export interface FinancesTableDetail {
  id: string;
  revenue: string;
  expense: string;
  profit: string;
  profitMargin: string;
  isChangeKpi: boolean;
}

export interface DataDepartment {
  revenueStaff?: string;
  revenueDepartment?: string;
  expenseDepartment?: string;
  profitDepartment?: string;
  profitMarginDepartment?: string;
}

type OptionType = {
  label: string;
  value: string;
};

export interface FilterListActions {
  label: string;
  options: OptionType[];
  handleSelected: (value: string) => void;
}

export interface PayloadCreateActivity {
  customerId: string;
  meetingAt: string;
  meetingForm: string;
  mentionedProject: string;
  satisfactionRate: number;
  purchaseRate: number;
  workHistory: string;
  informationExchanged: string;
  feedback: string;
  description: string;
  proposedSolutions: string;
  otherSource: string;
}

export interface Segment {
  id?: string;
  type?: string;
}
export interface LeadItem {
  id: string;
  name: string;
  projectName: string;
  projectId: string;
  note: string;
  email: string;
  phoneNumber: string;
  adress: string;
  segment: {
    id: string,
    type: string
  }
}

export interface PayloadUpdateLead {
  name: string
  email: string
  phoneNumber: string
  address: string
  mediaChannel: string
  source: string
  note: string
  needShuttle: false,
  id: string
}

export interface PayloadUpdateLeadSegment {
  segmentId: string
  ids: string[]
}

export interface PayloadLeadAllotment {
  ids: string[]
}
