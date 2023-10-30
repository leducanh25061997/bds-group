import { styled } from '@mui/material/styles';

import CT_BG from 'assets/background/background-citystar.svg';

import { Outlet } from 'react-router-dom';

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  background: theme.palette.grey[0],
  backgroundImage: `url(${CT_BG});`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  justifyContent: 'center',
  paddingInline: '16px',
}));

export default function CityStarLayout() {
  return (
    <>
      <RootStyle>
        <MainStyle>
          <Outlet />
        </MainStyle>
      </RootStyle>
    </>
  );
}
