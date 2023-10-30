import { lazyLoad } from 'utils/loadable';

export const Customer = lazyLoad(
  () => import('./index'),
  module => module.Customer,
);
