import { SubDataProtype } from "app/pages/TransactionManagement/components/ApartmentInformationManagement/slice/types";
import { StatusProductEnum } from "types/Enum";

/* --- STATE --- */
export interface LayoutsState {
  loading?: boolean;
  isShowSidebar?: boolean;
  isShowFilter?: boolean;
  apartmentInformation?: ApartmentInformation;
  isMultipleSelectTable?: boolean;
}

export interface ApartmentInformation {
  isShowRightBar?: boolean;
  apartmentId?: SubDataProtype[] | string
  status?: StatusProductEnum;
  isShowPrirityFilter?: boolean
}
