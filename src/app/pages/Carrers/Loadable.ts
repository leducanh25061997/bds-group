import { lazyLoad } from 'utils/loadable';

export const Carrers = lazyLoad(
  () => import('./index'),
  module => module.Carrers,
);
