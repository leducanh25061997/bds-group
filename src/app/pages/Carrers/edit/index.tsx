import { Box, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CreateRealEstate from '../create';

import { useRealEstateSlice } from '../slice';
import { selectRealEstate } from '../slice/selectors';

export default function EditRealEstate() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useRealEstateSlice();
  const { isLoading } = useSelector(selectRealEstate);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailRealEstate({ id }));
    }
    return () => {
      dispatch(actions.clearDataRealEstate());
    };
  }, [actions, dispatch, id]);

  return (
    <div>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <CreateRealEstate isEdit />
      )}
    </div>
  );
}
