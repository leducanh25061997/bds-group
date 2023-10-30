import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import FilterSlideBar from 'app/components/FilterSlideBar';
import useResponsive from 'app/hooks/useResponsive';

import DashboardNavbar from '../../components/NavBar';
import DashboardSidebar, {
  DRAWER_WIDTH,
  DRAWER_WIDTH_ON_MOBILE,
} from '../../components/Sidebar';

import { useLayoutsSlice } from './slice';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 60;
const APP_BAR_DESKTOP = 66;

const RootStyle = styled('div')({
  // display: 'flex',
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
  paddingTop: APP_BAR_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingTop: `${APP_BAR_DESKTOP + 19}px`,
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.down('lg')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const isDesktop = useResponsive('up', 'lg');
  const [open, setOpen] = useState(() => isDesktop);

  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const changeStatusSidebar = () => {
    setOpen(!open);
  };
  const hanleOpenStatusSidebar = () => {
    setOpen(true);
  };

  useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    dispatch(actions.showSidebar(open));
  }, [dispatch, actions, open]);
  return (
    <>
      <RootStyle>
        <DashboardNavbar
          isOpenSidebar={open}
          onOpenSidebar={changeStatusSidebar}
        />
        <FilterSlideBar />

        <Box>
          <DashboardSidebar
            isOpenSidebar={open}
            onCloseSidebar={() => setOpen(false)}
            onOpenSidebar={hanleOpenStatusSidebar}
          />
          <MainStyle
            sx={{
              paddingLeft: {
                lg: `calc(${
                  open ? DRAWER_WIDTH : DRAWER_WIDTH_ON_MOBILE
                }px + 24px)`,
              },
            }}
          >
            <Outlet />
          </MainStyle>
        </Box>
      </RootStyle>
    </>
  );
}
