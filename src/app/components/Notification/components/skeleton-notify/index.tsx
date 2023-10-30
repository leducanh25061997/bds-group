import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';

interface Props {
  notiLength: number;
}

export default function SkeletonNotify(props: Props) {
  const { notiLength } = props;
  return (
    <Box>
      {Array(notiLength)
        .fill(0)
        .map((item, index) => (
          <Grid p={1} container key={index}>
            <Grid item sm={1.8}>
              <Skeleton variant="circular" width={40} height={40} />
            </Grid>
            <Grid item sm={8.7}>
              <Skeleton variant="text" sx={{ fontSize: '0.5rem' }} />
              <Skeleton variant="rectangular" height={36} />
            </Grid>
          </Grid>
        ))}
    </Box>
  );
}
