import { Grid, Typography } from '@mui/material';
import React from 'react';

const FloorLabels: React.FC<{ floors: string[] }> = ({ floors }) => {
  return (
    <Grid
      container
      direction="column"
      rowSpacing={0.5}
      sx={{
        width: 40,
      }}
    >
      {floors
        .slice()
        .reverse()
        .map((f, idx) => (
          <Grid key={`${f}-${idx}`} item>
            <Typography
              variant="caption"
              display="inline-block"
              width={'100%'}
              minHeight={28}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {`F${f}`}
            </Typography>
          </Grid>
        ))}
    </Grid>
  );
};

export default FloorLabels;
