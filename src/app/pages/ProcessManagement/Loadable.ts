import { lazyLoad } from 'utils/loadable';

export const ProcessManagement = lazyLoad(
  () => import('./index'),
  module => module.ProcessManagement,
);
