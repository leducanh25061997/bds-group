import { lazyLoad } from 'utils/loadable';

export const Esalekit = lazyLoad(
  () => import('./index'),
  module => module.Esalekit,
);
