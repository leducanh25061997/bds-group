import { lazyLoad } from 'utils/loadable';

export const CustomerTransaction = lazyLoad(
  () => import('./index'),
  module => module.CustomerTransaction,
);
