import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreateCustomer from '../create';

import { useCustomerSlice } from '../slice';
import { selectCustomer } from '../slice/selector';

export default function EditCustomer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useCustomerSlice();
  const { isLoading } = useSelector(selectCustomer);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailCustomer({ id }));
    }
    return () => {
      dispatch(actions.clearDataCustomer());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      <CreateCustomer isEdit />
    </div>
  );
}
