import { Pageable } from 'types';
import { Status, TabMediaTypeEnum } from 'types/Enum';
import {
  EsalekitItem,
  GalleryHeaderItem,
  LefttabItem,
  HeaderTab,
} from 'types/Esalekit';

export interface EsalekitState {
  EsalekitManager?: Pageable<EsalekitItem>;
  EsalekitDetail?: EsalekitItem | null;
  LeftTabDetail?: LefttabItem | null;
  GalleryHeaderManager?: GalleryHeaderItem[] | [];
  GalleryHeaderType?: GalleryHeaderItem[] | [];
  AllGalleryManager?: GalleryHeaderItem[] | [];
  isLoading?: boolean;
  HeaderDetail?: HeaderTab | null;
}

export interface PayloadCreateLeftTab {
  name: string;
  esalekitId?: string;
}

export interface PayloadCreateHeadTab {
  name: string;
  leftTabId?: string;
  html?: string;
  mediaType?: TabMediaTypeEnum;
}

export interface PayloadGetEsalekit {
  id?: string;
}

export interface PayloadUpdateLeftTab extends PayloadCreateLeftTab {
  id?: string;
}

export interface PayloadUpdateHeadTab extends PayloadCreateHeadTab {
  id?: string;
}

export interface PayloadCreateGallery {
  headerId?: string;
  esalekitId?: string;
  title: string;
  url: string;
  type: TabMediaTypeEnum;
  thumbnail?: string;
  isAvatar?: boolean;
}

export interface PayloadCreateContent {
  title: string;
  url: string;
  type: TabMediaTypeEnum;
  thumbnail?: string;
}

export interface PayloadCreateGround {
  headerId?: string;
  data?: any;
}

export interface PayloadCreateConsultation {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
  projectId: string;
  projectName: string;
}
