import { lazyLoad } from 'utils/loadable';

export const SaleEventControl = lazyLoad(
  () => import('./index'),
  module => module.SaleEventControl,
);
