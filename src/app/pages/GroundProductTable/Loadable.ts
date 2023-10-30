/**
 *
 * Asynchronously loads the component for CreateClub
 *
 */

import { lazyLoad } from 'utils/loadable';

export const GroundProductTable = lazyLoad(
  () => import('./index'),
  module => module.GroundProductTable,
);
