import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import { useProjectSlice } from '../slice';
import { selectProject } from '../slice/selector';
import { CreateProject } from '../create';

const LoadingScreen = styled.div`
  display: flex;
  width: 100%;
  height: 333px;
  justify-content: center;
  align-items: center;
`;
export default function EditProject() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useProjectSlice();
  const { isLoading } = useSelector(selectProject);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailProject({ id }));
    }
    return () => {
      dispatch(actions.clearDataProject());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      <CreateProject isEdit />
    </div>
  );
}
