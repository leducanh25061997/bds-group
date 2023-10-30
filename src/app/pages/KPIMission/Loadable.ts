import { lazyLoad } from 'utils/loadable';

export const KPIMission = lazyLoad(
  () => import('./index'),
  module => module.KPIMission,
);
