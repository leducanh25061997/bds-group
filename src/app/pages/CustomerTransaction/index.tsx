import {
  Box,
  useTheme
} from '@mui/material';
import { Fragment } from 'react';
import ListCustomers from './components/list';

export function CustomerTransaction() {
  const theme = useTheme();
  return (
    <Fragment>
       <Box
        bgcolor={theme.palette.grey[0]}
        p={3}
        sx={{
          borderRadius: 3,
          mt: '-10px',
          minHeight: 'calc(99%)',
        }}
      >
        <ListCustomers />
      </Box>
    </Fragment>
  );
}
