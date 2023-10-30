import { lazyLoad } from 'utils/loadable';

export const ProductTableSetting = lazyLoad(
  () => import('./index'),
  module => module.ProductTableSetting,
);
