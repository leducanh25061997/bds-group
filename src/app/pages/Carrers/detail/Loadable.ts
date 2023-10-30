import { lazyLoad } from 'utils/loadable';

export const RealEstateDetail = lazyLoad(
  () => import('./index'),
  module => module.RealEstateDetail,
);
