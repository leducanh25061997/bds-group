/**
 *
 * Asynchronously loads the component for CreateClub
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ManagementInformation = lazyLoad(
  () => import('./index'),
  module => module.ManagementInformation,
);
