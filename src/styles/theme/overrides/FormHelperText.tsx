// ----------------------------------------------------------------------

import { Theme } from '@mui/material';

export default function FormHelperText(theme: Theme) {
  return {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
          backgroundColor: 'unset',
          fontWeight: 500,
          lineHeight: '20px',
          marginLeft: '0',
        },
        '& .Mui-error': {
          color: theme.palette.error.main,
        },
      },
    },
  };
}
