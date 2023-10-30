import { Pageable } from 'types';
import { ProjectItem } from 'types/Project';
import { WorkFlowTypeEnum } from 'types/Enum';

import { StaffItem } from './../../ProcessManagement/slice/type';

export interface ProjectState {
  ProjectManagement?: Pageable<ProjectItem>;
  isLoading?: boolean;
  ProjectDetail?: ProjectItem | null;
  ListStaffInProject?: Pageable<StaffItem>;
}

export interface PayloadCreateProject {
  name: string;
  code: string;
  type: string;
  status: string;
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
  avatarEsalekit: string;
}

export interface PayloadGetDetailProject {
  id: string;
}

export interface PayloadUpdateProject extends PayloadCreateProject {
  id?: string;
}

export interface PayloadGetWorkFlowTree {
  id: string;
  type: WorkFlowTypeEnum;
}
