import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import CreateComisstion from '../create';

import { useComisstionPolicySlice } from '../slice';
import { selectComisstion } from '../slice/selector';

const LoadingScreen = styled.div`
  display: flex;
  width: 100%;
  height: 333px;
  justify-content: center;
  align-items: center;
`;
export default function EditComisstionPolicy() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useComisstionPolicySlice();
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
      <CreateComisstion isEdit />
    </div>
  );
}
