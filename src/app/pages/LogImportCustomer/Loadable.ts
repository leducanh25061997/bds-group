import { lazyLoad } from 'utils/loadable';

export const LogImportCustomer = lazyLoad(
  () => import('./index'),
  module => module.LogImportCustomer,
);
