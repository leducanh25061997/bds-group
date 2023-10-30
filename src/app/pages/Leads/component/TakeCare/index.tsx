import { Box, useTheme } from '@mui/material';
import { Fragment } from 'react';
import FinanceStaff from './takecare';

export function TakeCareLeads() {
  const theme = useTheme();
  return (
    <Fragment>
    <Box
      bgcolor={theme.palette.grey[0]}
      p={3}
      sx={{
        marginLeft: { xs: '12px', sm: '24px', lg: '0px' },
        marginRight: { xs: '12px', sm: '24px', lg: '0px' },
        borderRadius: 3,
        mt: '-10px',
        minHeight: 'calc(99%)',
      }}
    >
      <FinanceStaff />
    </Box>
  </Fragment>
);
}
