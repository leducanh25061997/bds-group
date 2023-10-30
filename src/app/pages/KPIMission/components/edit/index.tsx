import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';

import { useKpiMissionSlice } from '../../slice';
import { selectKpiMissionState } from '../../slice/selectors';
import { CreateKpiMission } from '../create';

export function EditKpiMission() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useKpiMissionSlice();
  const { isLoading } = useSelector(selectKpiMissionState);

  React.useEffect(() => {
    if (id) {
      dispatch(actions.getDetailKpiMission({ id }));
    }
    return () => {
      dispatch(actions.clearDetailKpiMission());
    };
  }, [actions, dispatch, id]);

  return (
    <Grid>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%">
          <Box pt={'60%'} />
        </Skeleton>
      ) : (
        <CreateKpiMission isEdit />
      )}
    </Grid>
  );
}
