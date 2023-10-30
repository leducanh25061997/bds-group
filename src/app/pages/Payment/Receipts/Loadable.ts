import { lazyLoad } from 'utils/loadable';

export const Receipts = lazyLoad(
  () => import('./index'),
  module => module.ReceiptsPage,
);
