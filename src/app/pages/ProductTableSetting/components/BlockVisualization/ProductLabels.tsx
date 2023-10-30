import { Grid, Typography } from '@mui/material';
import React from 'react';

const ProductLabels: React.FC<{ products: string[] }> = ({ products }) => {
  return (
    <Grid
      container
      justifyContent="flex-end"
      columnSpacing={0.5}
      sx={{
        mt: 0.75,
      }}
    >
      {products.map((p, idx) => (
        <Grid key={`${p}-${idx}`} item>
          <Typography
            variant="caption"
            display="inline-block"
            // width={'100%'}
            width={28}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {p}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductLabels;
