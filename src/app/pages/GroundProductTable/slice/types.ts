export interface GroundProductTableState {
  isLoading: boolean;
  groundProductTableData?: GroundProductTableData | null;
}

export interface GroundProductTableData {
  data: GroundProductTableDataSettings[];
  jsonGround?: string;
  file?: string;
  message?: string;
  // data: {
  //   settings: GroundProductTableDataSettings[];
  //   jsonGround: string;
  //   file: string;
  // };
}

interface GroundProductTableDataSettings {
  createdAt: string;
  updatedAt: string;
  id: string;
  fileId: string;
  settingTableProjectId: string;
  settingTableBlock: any;
  projectId: string;
  block: string;
  dataFloor: string;
  dataQuanlityProduct: string;
}
