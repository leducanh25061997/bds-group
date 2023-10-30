import { lazyLoad } from 'utils/loadable';

export const CityStar = lazyLoad(
  () => import('./index'),
  module => module.CityStar,
);
