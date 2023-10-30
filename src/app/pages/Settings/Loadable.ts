import { lazyLoad } from 'utils/loadable';

export const Settings = lazyLoad(
  () => import('./index'),
  module => module.Settings,
);
