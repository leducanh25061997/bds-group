import { lazyLoad } from 'utils/loadable';

export const ProjectSetting = lazyLoad(
  () => import('./index'),
  module => module.ProjectSetting,
);
