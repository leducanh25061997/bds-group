import { lazyLoad } from 'utils/loadable';

export const ContractDetail = lazyLoad(
  () => import('./index'),
  module => module.ContractDetail,
);
