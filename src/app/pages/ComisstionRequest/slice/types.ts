import { Pageable } from 'types';
import { PropertyType } from 'types/Property';

export interface SettingState {
  isLoading?: boolean;
  listPropertyType?: PropertyType[];
}
export interface PayloadCommentContract {
  id?: string;
  commentId?: string;
  reply?: string;
  comment?: string;
}
