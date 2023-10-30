import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreatCategory from '../create';
import { useCategorySlice } from '../slice';
import { selectCategory } from '../slice/selector';

const DetailCategory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useCategorySlice();
  const { isLoading } = useSelector(selectCategory);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailCategory({ id }));
    }
  }, [actions, dispatch, id]);

  return (
    <Box>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <CreatCategory isDetail />
      )}
    </Box>
  );
};

export default DetailCategory;
