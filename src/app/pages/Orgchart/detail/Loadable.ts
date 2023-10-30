import { lazyLoad } from 'utils/loadable';

export const OrgchartDetail = lazyLoad(
  () => import('./index'),
  module => module.OrgchartDetail,
);
