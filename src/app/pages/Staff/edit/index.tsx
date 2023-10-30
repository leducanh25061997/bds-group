import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreateStaff from '../create';

import { useStaffSlice } from '../slice';
import { selectStaff } from '../slice/selector';

export default function EditStaff() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useStaffSlice();
  const { isLoading } = useSelector(selectStaff);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailStaff({ id }));
    }
    return () => {
      dispatch(actions.clearDataStaff());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      <CreateStaff isEdit />
    </div>
  );
}
