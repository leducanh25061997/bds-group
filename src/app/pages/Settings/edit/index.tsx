import { Box, Skeleton } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import CreateContract from '../create';

import { useSettingSlice } from '../slice';
import { selectSetting } from '../slice/selector';

export default function EditContract() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useSettingSlice();
  const { isLoading } = useSelector(selectSetting);
  const location = useLocation();
  const isAppendix = useMemo(() => {
    if (location?.pathname.includes('/appendix')) {
      return true;
    }
    return false;
  }, [location]);

  useEffect(() => {
    if (id) {
      dispatch(actions.getRoleDetail({ id }));
    }
    return () => {
      dispatch(actions.clearDataContract());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <CreateContract isEdit isAppendix={isAppendix} />
      )}
    </div>
  );
}
