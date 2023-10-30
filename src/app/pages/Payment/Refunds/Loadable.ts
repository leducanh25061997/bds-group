import { lazyLoad } from 'utils/loadable';

export const Refunds = lazyLoad(
  () => import('./index'),
  module => module.RefundsPage,
);
