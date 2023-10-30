import { Box, Drawer } from '@mui/material';
import { MHidden } from 'app/components/@material-extend';
import Scrollbar from 'app/components/Scrollbar';
import { selectAuth } from 'app/pages/Auth/slice/selectors';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { LeftTab } from 'types/Esalekit';

import SidebarMenu from './SidebarMenu';

export const DRAWER_WIDTH = 78;
export const DRAWER_WIDTH_ON_MOBILE = 50;

interface Props {
  dataSidebar?: LeftTab[];
  onChangeTabSidebar: (id: any) => void;
  openDialogAddTab?: () => void;
  openDialogDelTab?: () => void;
}

export default function DashboardSidebarPreview(props: Props) {
  const {
    dataSidebar,
    onChangeTabSidebar,
    openDialogAddTab,
    openDialogDelTab,
  } = props;
  
  const renderContent = (
    <Scrollbar
      sx={{
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        bgcolor: '#0F1C2F',
      }}
    >
      <SidebarMenu
        dataSidebar={dataSidebar}
        onChangeTabSidebar={onChangeTabSidebar}
        openDialogAddTab={openDialogAddTab}
        openDialogDelTab={openDialogDelTab}
      />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        alignSelf: 'center',
        mr: 4,
        position: 'fixed',
        zIndex: 1000,
        left: 43,
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <MHidden width="mdDown">
        <Drawer
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: '#ECECEE',
              transform: 'unset !important',
              visibility: 'unset !important',
              position: 'relative',
              border: 'none',
              background: 'transparent',
              borderRadius: '12px',
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </Box>
  );
}
