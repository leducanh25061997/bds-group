import { lazyLoad } from 'utils/loadable';

export const ContentManagement = lazyLoad(
  () => import('./index'),
  module => module.ContentManagement,
);
