import { lazyLoad } from 'utils/loadable';

export const Staff = lazyLoad(
  () => import('./index'),
  module => module.Staff,
);
