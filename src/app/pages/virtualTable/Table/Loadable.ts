import { lazyLoad } from 'utils/loadable';

export const VirtualTable = lazyLoad(
  () => import('./index'),
  module => module.VirtualTable,
);
