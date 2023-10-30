import { lazyLoad } from 'utils/loadable';

export const Reports = lazyLoad(
  () => import('./index'),
  module => module.Reports,
);
