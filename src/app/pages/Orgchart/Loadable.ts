import { lazyLoad } from 'utils/loadable';

export const Orgchart = lazyLoad(
  () => import('./index'),
  module => module.Orgchart,
);
