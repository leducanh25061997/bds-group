import { lazyLoad } from 'utils/loadable';

export const Comisstion = lazyLoad(
  () => import('./index'),
  module => module.Comisstion,
);
