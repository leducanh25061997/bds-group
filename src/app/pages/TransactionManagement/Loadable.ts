import { lazyLoad } from 'utils/loadable';

export const TransactionManagement = lazyLoad(
  () => import('./index'),
  module => module.TransactionManagement,
);
