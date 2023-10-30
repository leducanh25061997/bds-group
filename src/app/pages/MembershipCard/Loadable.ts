import { lazyLoad } from 'utils/loadable';

export const MembershipCard = lazyLoad(
  () => import('./index'),
  module => module.MembershipCard,
);
