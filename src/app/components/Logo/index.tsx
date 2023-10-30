/**
 *
 * Logo
 *
 */
import { Box, useTheme } from '@mui/material';
import * as React from 'react';

export function Logo() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        color: theme.palette.primary.main,
        textAlign: 'end',
        '& img': {
          width: '250px',
        },
      }}
    >
      <img src="/static/images/logo_papahub.svg" alt="Fail" />
    </Box>
  );
}
