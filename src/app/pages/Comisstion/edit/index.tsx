import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreateComisstion from '../create';

import { useComisstionSlice } from '../slice';
import { selectComisstion } from '../slice/selector';

export default function EditComisstion() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useComisstionSlice();
  const { isLoading } = useSelector(selectComisstion);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailComisstion({ id }));
      dispatch(actions.fetchRoleList());
    }
    return () => {
      dispatch(actions.clearDataComisstion());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <CreateComisstion isEdit />
      )}
    </div>
  );
}
