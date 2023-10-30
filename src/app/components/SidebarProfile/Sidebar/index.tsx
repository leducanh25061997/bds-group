import path from 'app/routes/path';
import LOGOUT_ICON from 'assets/background/logout-icon.svg';
import { Fragment, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { LocalStorageService } from 'services';

// import PROJECT_ICON from 'assets/background/project-icon.svg';
import USER_ICON_PROFILE_ACTIVE from 'assets/background/user-profile.svg';

import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  Typography,
  useTheme,
} from '@mui/material';
import { useProfile } from 'app/hooks';
import classNames from 'classnames';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import palette from 'styles/theme/palette';
import { PermissionKeyEnum } from 'types/Permission';
import { Permission } from 'types';

const MenuContainer = styled(List)`
  position: unset;
  flex-grow: 1;
  overflow: auto;
`;

const MenuItem = styled(ListItemButton)`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  margin-bottom: 11px;
  &.active {
    background: #fef4fa;
    p {
      font-weight: 700;
      color: #d6465f;
    }
  }
`;

const MenuItemChild = styled(ListItemButton)`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0px 10px 15px;
  margin-bottom: 11px;
  &.active {
    p {
      color: #d6465f;
    }
  }
`;

interface Props {
  isOpenSidebar: boolean;
  onOpenSidebar: () => void;
}

export default function Sidebar(props: Props) {
  const { isOpenSidebar, onOpenSidebar } = props;
  const location = useLocation();
  const theme = useTheme();
  const [leftMenu, setLeftMenu] = useState(path.dashboards);
  const [listPermission, setListPermission] = useState<Permission[]>([]);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const userInfo = useProfile();

  useEffect(() => {
    const permissions = userInfo?.role?.permissions || [];
    setListPermission(permissions);
  }, [userInfo]);

  const checkPermissionExist = (permissionKey: string[]) => {
    for (let index = 0; index < permissionKey.length; index++) {
      const permission = listPermission.find(
        elementChild => elementChild.key === permissionKey[index],
      );
      if (permission) {
        return true;
      }
    }
    return false;
  };

  const config = useMemo(() => {
    return [
      {
        id: 2,
        label: t(translations.sidebar.profileInfor),
        icon: USER_ICON_PROFILE_ACTIVE,
        iconactive: USER_ICON_PROFILE_ACTIVE,
        path: path.Profile,
        // permission: [
        //   PermissionKeyEnum.PROJECT_READ,
        //   PermissionKeyEnum.PROJECT_CREATE,
        // ],
      },
    ];
  }, [leftMenu, t, userInfo]);

  const onLogOut = () => {
    LocalStorageService.removeAllItem();
    navigate(path.login);
    window.location.reload();
  };


  return (
    <>
      <MenuContainer style={{
        flexGrow: 0,
        height: 'unset'
      }}>
        {isOpenSidebar ? (
          config?.map(tabConfig => (
            <Fragment key={tabConfig.id}>
              <MenuItem
                sx={{ margin: '0px 6px 0px 6px' }}
                // style={{
                //   display: checkPermissionExist(tabConfig.permission)
                //     ? ''
                //     : 'none',
                // }}
                className={classNames({
                  active: location.pathname.includes(tabConfig.path as string),
                })}
              >
                <Box display={'flex'} alignItems={'center'}>
                  <img
                    src={
                      location.pathname.includes(tabConfig.path as string)
                        ? tabConfig.iconactive
                        : tabConfig.icon
                    }
                    style={{ height: 28, width: 28 }}
                    alt="icon tab"
                  />
                  <Typography
                    fontSize={'14px'}
                    lineHeight={'17px'}
                    fontWeight={'400'}
                    color={palette.primary.text}
                    ml={'15px'}
                  >
                    {tabConfig.label}
                  </Typography>
                </Box>
              </MenuItem>
            </Fragment>
          ))
        ) : (
          <>
            {config?.map(tabConfig => (
              <Box
                key={tabConfig.id}
                // style={{
                //   display: checkPermissionExist(tabConfig.permission)
                //     ? ''
                //     : 'none',
                // }}
                display="flex"
                justifyContent="center"
                py={2}
                sx={theme => ({
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme.palette.grey[200],
                  },
                  borderRadius: '8px',
                  margin: '8px',
                  background: location.pathname.includes(
                    tabConfig.path as string,
                  )
                    ? '#FEF4FA'
                    : 'unset',
                })}
              >
                <img src={tabConfig.icon} alt="icon tab" />
              </Box>
            ))}
          </>
        )}
        <Box
          textAlign="end"
          sx={{
            bottom: 0,
            ml: '16px',
          }}
        ></Box>
      </MenuContainer>
      {/* <Divider sx={{ background: '#F2F2F2', mt: '30px', mb: '5px' }} /> */}
      <Box
        onClick={onLogOut}
        sx={{
          display: 'flex',
          alignItems: 'center',
          pb: '12px',
          pt: '12px',
          pl: '20px',
          m: '5px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#fef4fa',
          },
          borderRadius: '20px',
        }}
      >
        <img
          src={LOGOUT_ICON}
          style={{ height: 28, width: 28 }}
          alt="icon tab"
        />
        {isOpenSidebar && (
          <Typography
            fontSize={'14px'}
            lineHeight={'16px'}
            fontWeight={'400'}
            color={palette.text}
            ml={'12px'}
          >
            {'Đăng xuất'}
          </Typography>
        )}
      </Box>
    </>
  );
}