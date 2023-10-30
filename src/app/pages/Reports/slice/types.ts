import { Pageable } from 'types';

export interface CategoryState {
  isLoading?: boolean;
  categoriesList?: Pageable<CategoryItem>;
  categoryDetail?: CategoryItem;
}

export interface CategoryItem {
  id?: string;
  name: string;
  description: string;
  createdAt?: string;
  type?: string;
  status?: boolean;
}

export type PayloadCreateCategory = Pick<
  CategoryItem,
  'name' | 'description' | 'type'
>;

export type PayloadGetDetailCategory = Pick<CategoryItem, 'id'>;
