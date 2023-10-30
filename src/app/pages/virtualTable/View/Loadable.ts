import { lazyLoad } from 'utils/loadable';

export const VirtualView = lazyLoad(
  () => import('./index'),
  module => module.VirtualView,
);
