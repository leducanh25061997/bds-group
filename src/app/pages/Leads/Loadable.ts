import { lazyLoad } from 'utils/loadable';

export const Leads = lazyLoad(
  () => import('./index'),
  module => module.Leads,
);
