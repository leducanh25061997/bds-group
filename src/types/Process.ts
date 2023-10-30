import { ListCreateWorkFlow } from 'app/pages/ProcessManagement/slice/type';

export interface ProcessType {
  createdAt: string;
  firstNode: string;
  id: string;
  isAutoChangeStep: boolean;
  name: string;
  type: string;
  updatedAt: string;
  code: string;
  workFlows: ListCreateWorkFlow[];
}
