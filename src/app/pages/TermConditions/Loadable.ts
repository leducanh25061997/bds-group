import { lazyLoad } from 'utils/loadable';

export const TermConditions = lazyLoad(
  () => import('./index'),
  module => module.TermConditions,
);
