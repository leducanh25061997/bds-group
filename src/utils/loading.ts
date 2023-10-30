import { layoutsActions } from 'app/pages/Layouts/slice';

import { store } from '..';

export const showLoading = () => store.dispatch(layoutsActions.showLoading());
export const hideLoading = () => store.dispatch(layoutsActions.hideLoading());
