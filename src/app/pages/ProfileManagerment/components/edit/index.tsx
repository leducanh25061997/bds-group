import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreateStaff from '../create';


import CreateUser from '../create';
import { useStaffSlice } from 'app/pages/Staff/slice';
import { selectStaff } from 'app/pages/Staff/slice/selector';

interface Props {
  id?: string;
}

export default function EditUser(props: Props) {
  const { id } = props;

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
      <CreateUser />
    </div>
  );
}
