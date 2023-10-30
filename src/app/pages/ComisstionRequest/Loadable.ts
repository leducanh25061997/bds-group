import { lazyLoad } from 'utils/loadable';

export const ComisstionRequest = lazyLoad(
  () => import('./index'),
  module => module.ComisstionRequest,
);
