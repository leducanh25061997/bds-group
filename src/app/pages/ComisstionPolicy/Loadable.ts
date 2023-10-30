import { lazyLoad } from 'utils/loadable';

export const ComisstionPolicy = lazyLoad(
  () => import('./index'),
  module => module.ComisstionPolicy,
);
