import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useProfile } from 'app/hooks';
import { useSafeState } from 'app/hooks/useSafeState';
import { useAuthSlice } from 'app/pages/Auth/slice';
import path from 'app/routes/path';
import ARROW_DOWN from 'assets/background/arrow_down.svg';
import SHOW_PASS_ICON from 'assets/background/change-pass-icon.svg';
import LOGOUT_ICON from 'assets/background/logout-icon.svg';
import { translations } from 'locales/translations';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LocalStorageService } from 'services';
import { checkTimeCurrent, renderFile } from 'utils/helpers';
import palette from 'styles/theme/palette';

import ChangePasswordDialog from '../ChangePasswordDialog/index';
import InformationDialog from '../InformationDialog';
import MenuPopover from '../MenuPopover';

const InfoUserStyle = styled('div')(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '19.6px',
  fontWeight: 700,
  color: theme.palette.primary.light,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: '200px',
  textAlign: 'left',
}));
export default function AccountPopover() {
  const [open, setOpen] = useSafeState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useSafeState<boolean>(false);
  const [isForgetPassword, setIsForgetPassword] = useSafeState<boolean>(false);
  const [isOpenDialogInformation, setIsOpenDialogInformation] =
    useSafeState<boolean>(false);
  const [isEditInformation, setIsEditInformation] =
    useSafeState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const handleLogout = () => {
    LocalStorageService.removeAllItem();
    setOpen(false);
    navigate(path.login);
    window.location.reload();
  };
  const { actions } = useAuthSlice();
  const anchorRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getUserInfo());
  }, [dispatch, actions]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const userInfo = useProfile();

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setIsForgetPassword(false);
  };

  const forgetPasswordHandle = (value: boolean) => {
    setIsForgetPassword(value);
  };

  const closeDialogInformation = () => {
    setIsOpenDialogInformation(false);
    setIsEditInformation(false);
  };

  const handleRedirectPage = () => {
    if (userInfo?.staff?.id) {
      navigate(`/profile`);
      handleClose();
    }
  };

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: '6px 0px',
          justifyContent: 'center',
        }}
      >
        <Avatar src={renderFile(userInfo?.avatar)} alt="photoURL" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginRight: 10,
            marginLeft: 5,
            width: '150px',
          }}
        >
          <Typography
            ml={1}
            fontSize={'12px'}
            lineHeight={'16.8px'}
            fontWeight={400}
            color={'white'}
          >
            {checkTimeCurrent()}
          </Typography>
          <Typography
            ml={1}
            fontSize={'14px'}
            lineHeight={'19.6px'}
            fontWeight={700}
            color={'white'}
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '140px',
              textAlign: 'left',
            }}
          >
            {userInfo?.staff?.fullName}
          </Typography>
        </div>
        {/* this button should not inside other button: QuangHVN */}
        <div style={{ width: '30px', height: '100%' }}>
          <img src={ARROW_DOWN} alt="More icon nav" />
        </div>
      </Button>
      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 'max-content' }}
      >
        <List sx={{ p: '12px 0px' }}>
          {userInfo?.staff && (
            <ListItemButton
              sx={{
                display: 'flex',
                px: 2,
                py: 1,
                background: palette.primary.lightRed,
              }}
              onClick={handleRedirectPage}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{ width: '50px', height: '50px' }}
                  src={renderFile(userInfo?.avatar)}
                  alt="photoURL"
                />
              </Box>
              <Box ml={1} sx={{ display: 'block' }}>
                <InfoUserStyle>{userInfo?.staff?.fullName}</InfoUserStyle>
                {userInfo?.staff?.position && (
                  <InfoUserStyle sx={{ fontWeight: 500 }}>
                    {userInfo?.staff?.position}
                  </InfoUserStyle>
                )}
                {userInfo?.staff?.orgChart?.name && (
                  <InfoUserStyle sx={{ fontWeight: 600 }}>
                    {userInfo?.staff?.orgChart.name}
                  </InfoUserStyle>
                )}
              </Box>
            </ListItemButton>
          )}
          <ListItemButton sx={{ py: 1 }} onClick={handleOpenDialog}>
            <Box display={'flex'} alignItems={'center'}>
              <img src={SHOW_PASS_ICON} alt="Show password icon" />
              <Typography
                ml={1}
                fontSize={'14px'}
                lineHeight={'17px'}
                fontWeight={600}
                color={theme.palette.primary.light}
              >
                {t(translations.common.changePassword)}
              </Typography>
            </Box>
          </ListItemButton>
          <ListItemButton sx={{ py: 1, mt: 0.5 }} onClick={handleLogout}>
            <Box display={'flex'} alignItems={'center'}>
              <img src={LOGOUT_ICON} alt="Hide password icon" />
              <Typography
                ml={1}
                fontSize={'14px'}
                lineHeight={'17px'}
                fontWeight={600}
                color={theme.palette.primary.light}
              >
                {t(translations.common.logout)}
              </Typography>
            </Box>
          </ListItemButton>
        </List>
      </MenuPopover>
      {isOpenDialog && (
        <>
          {!isForgetPassword && (
            <ChangePasswordDialog
              onForgetPassword={forgetPasswordHandle}
              isOpen={isOpenDialog}
              handleClose={handleCloseDialog}
            />
          )}
        </>
      )}
      {isOpenDialogInformation && (
        <InformationDialog
          isOpen={isOpenDialogInformation}
          handleClose={closeDialogInformation}
          isEditInformation={isEditInformation}
          setIsEditInformation={setIsEditInformation}
        />
      )}
    </>
  );
}
