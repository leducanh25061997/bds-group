import { lazyLoad } from 'utils/loadable';

export const SalesProgram = lazyLoad(
  () => import('./index'),
  module => module.SalesProgram,
);
