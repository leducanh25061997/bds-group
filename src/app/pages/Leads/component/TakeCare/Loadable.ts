import { lazyLoad } from 'utils/loadable';

export const TakeCareLeads = lazyLoad(
  () => import('./index'),
  module => module.TakeCareLeads,
);
