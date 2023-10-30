import {
  showLoading as showAppLoading,
  hideLoading as hideAppLoading,
} from 'utils/loading';

export const useLoading = (props?: any) => {
  const showLoading = () => showAppLoading();

  const hideLoading = () => hideAppLoading();

  return { showLoading, hideLoading };
};
