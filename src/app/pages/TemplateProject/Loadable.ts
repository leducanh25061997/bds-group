import { lazyLoad } from 'utils/loadable';

export const TemplateProject = lazyLoad(
  () => import('./index'),
  module => module.TemplateProject,
);
