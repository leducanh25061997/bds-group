import { styled, Box } from '@mui/material';

export const BoxSearch = styled(Box)(({ theme }) => ({
  width: '340px',
  display: 'inline-flex',
  backgroundColor: `${theme.palette.common.white} !important`,
  alignItems: 'center',
  borderRadius: '8px',
  height: '41px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  input: {
    fontSize: '16px',
    paddingLeft: '16px',
    border: 'none',
    height: '100%',
    width: '100%',
    outline: 'none',
    background: `${theme.palette.secondary.lighter}`,
  },
}));

export const BoxSearchIconImage = styled('img')(({ theme }) => ({
  width: '40px',
  height: '40px',
  paddingLeft: '16px',
}));
