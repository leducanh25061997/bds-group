import { lazyLoad } from 'utils/loadable';

export const SaleEventTransaction = lazyLoad(
  () => import('./index'),
  module => module.SaleEventTransaction,
);
