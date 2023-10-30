import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import SaleEventNavbar from '../SaleEvent/components/NavBar';

const APP_BAR_MOBILE = 60;
const APP_BAR_DESKTOP = 66;

const RootStyle = styled('div')({
  minHeight: '100%',
  overflow: 'hidden',
  background: '#f2f2f2',
});

const MainStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  minHeight: 'calc(100vh)',
  height: '100%',
  paddingBottom: 24,
  paddingTop: APP_BAR_MOBILE + 12,
  [theme.breakpoints.up('lg')]: {
    paddingTop: `${APP_BAR_DESKTOP + 12}px`,
    paddingInline: theme.spacing(3),
  },
  [theme.breakpoints.down('lg')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const SaleEventLayout = () => {
  return (
    <RootStyle>
      <SaleEventNavbar />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
};

export default SaleEventLayout;
