import { Box, Drawer } from '@mui/material';
import { MHidden } from 'app/components/@material-extend';
import Scrollbar from 'app/components/Scrollbar';
import { selectAuth } from 'app/pages/Auth/slice/selectors';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { LeftTab } from 'types/Esalekit';

import SidebarMenu from './SidebarMenu';

// ----------------------------------------------------------------------

export const DRAWER_WIDTH = 80;
export const DRAWER_WIDTH_ON_MOBILE = 50;
// ----------------------------------------------------------------------

interface Props {
  dataSidebar?: LeftTab[];
  onChangeTabSidebar: (id: any) => void;
  openDialogAddTab?: () => void;
  openDialogDelTab?: () => void;
}

export default function DashboardSidebar(props: Props) {
  const {
    dataSidebar,
    onChangeTabSidebar,
    openDialogAddTab,
    openDialogDelTab,
  } = props;
  const { userInfo } = useSelector(selectAuth);
  const [isUpDateInfo, setIsUpDateInfo] = useState<boolean>(false);
  const [isShowDialogInforMation, setIsShowDialogInforMation] =
    useState<boolean>(false);

  const handleSubmitDialog = useCallback(() => {
    setIsUpDateInfo(false);
    setIsShowDialogInforMation(true);
  }, []);

  const handleCloseDialog = () => {
    setIsUpDateInfo(false);
    setIsShowDialogInforMation(false);
  };
  const renderContent = (
    <Scrollbar
      sx={{
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        position: 'relative',
        pt: '50px',
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
    <Box sx={{ height: '100%', background: '#0F1C2F' }}>
      <MHidden width="mdDown">
        <Drawer
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              transform: 'unset !important',
              visibility: 'unset !important',
              position: 'relative',
              border: 'none',
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </Box>
  );
}
