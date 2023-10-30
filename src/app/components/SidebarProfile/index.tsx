import { useCallback, useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

import { Box, Drawer } from '@mui/material';

import Scrollbar from 'app/components/Scrollbar';

import { AccountType } from 'types/Enum';

import { MHidden } from 'app/components/@material-extend';

import { useSelector } from 'react-redux';
import { selectAuth } from 'app/pages/Auth/slice/selectors';

import DialogUpdateInfo from 'app/pages/Dashboard/component/DiaLogUpdateInfo';

import InformationDialog from '../InformationDialog';

import Sidebar from './Sidebar';

// ----------------------------------------------------------------------

export const DRAWER_WIDTH = 240;
export const DRAWER_WIDTH_ON_MOBILE = 120;
// ----------------------------------------------------------------------

interface Props {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
  onOpenSidebar: () => void;
}

export default function ProfileSidebar(props: Props) {
  const { isOpenSidebar, onCloseSidebar, onOpenSidebar } = props;
  // const { pathname } = useLocation();
  const { userInfo } = useSelector(selectAuth);
  const [isUpDateInfo, setIsUpDateInfo] = useState<boolean>(false);
  const [isShowDialogInforMation, setIsShowDialogInforMation] =
    useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditInforMation, setIsEditInforMation] = useState<boolean>(false);
  // const idAdmin = userInfo?.isAdmin;

  // useEffect(() => {
  //   if (idAdmin) {
  //     setIsUpDateInfo(true);
  //   }
  // }, [idAdmin]);

  const handleSubmitDialog = useCallback(() => {
    setIsUpDateInfo(false);
    setIsShowDialogInforMation(true);
  }, []);

  const handleCloseDialog = () => {
    setIsUpDateInfo(false);
    setIsShowDialogInforMation(false);
  };

  // useEffect(() => {
  //   if (isOpenSidebar) {
  //     onCloseSidebar();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // height: 'calc(100% - 96px)',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        // width:'100%',
        position: 'relative',
        mt: 9.5,
        ml: '20px',
        mb: 3,
        bgcolor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        flexGrow: 0,
      }}
    >
      <Sidebar
        isOpenSidebar={isOpenSidebar}
        onOpenSidebar={onOpenSidebar}
      />
    </Scrollbar>
  );

  return (
    <Box
      sx={theme => ({
        [theme.breakpoints.up('md')]: {
          flexShrink: 0,
          width: isOpenSidebar ? DRAWER_WIDTH : DRAWER_WIDTH_ON_MOBILE,
        },
      })}
    >
      <MHidden width="mdDown">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          variant="persistent"
          PaperProps={{
            sx: {
              width: isOpenSidebar ? DRAWER_WIDTH : DRAWER_WIDTH_ON_MOBILE,
              bgcolor: '#ECECEE',
              transform: 'unset !important',
              visibility: 'unset !important',
              border: 'none',
              background: 'transparent',
              flexGrow: 0,
              height: 'unset'
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
      {isUpDateInfo && (
        <DialogUpdateInfo
          isOpen={isUpDateInfo}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
        />
      )}
      {isShowDialogInforMation && (
        <InformationDialog
          isOpen={isShowDialogInforMation}
          handleClose={handleCloseDialog}
          isEditInformation={true}
          setIsEditInformation={setIsEditInforMation}
        />
      )}
    </Box>
  );
}
