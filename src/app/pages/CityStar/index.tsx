import { Box, List, ListItemButton, Typography, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import { translations } from 'locales/translations';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import palette from 'styles/theme/palette';

import { useProfile } from 'app/hooks';
import document from 'services/api/document';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist } from 'utils/helpers';
import MenuPopover from 'app/components/MenuPopover';

import ListComisstions from './components/CustomerCityStar';

export function CityStar() {
  const theme = useTheme();
  const { t } = useTranslation();
  const userInfo = useProfile();
  const anchorRef = useRef(null);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const downloadListCusstomer = () => {
    document.downloadCustomerMembershipExcel();
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
          paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
        }}
      ></Box>
      <Box
        bgcolor={theme.palette.grey[0]}
        p={3}
        sx={{
          marginLeft: { xs: '12px', sm: '24px', lg: '0px' },
          marginRight: { xs: '12px', sm: '24px', lg: '0px' },
          borderRadius: 3,
          mt: '-10px',
          minHeight: 'calc(99%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '50px',
          }}
        >
          <Typography
            fontSize={'20px'}
            fontWeight={'700'}
            color={palette.primary.text}
          >
            {t(translations.sidebar.customerCityStar)}
          </Typography>

          <CustomButton
            title={t(translations.common.download)}
            isIcon
            isHide={
              !checkPermissionExist(
                PermissionKeyEnum.CUSTOMER_CITYSTAR_VIEW_ALL,
                userInfo,
              )
            }
            propRef={anchorRef}
            buttonMode={'download'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
              mb: '20px',
            }}
            handleClick={handleOpenDialog}
          />
          <MenuPopover
            open={isOpenDialog}
            onClose={handleCloseDialog}
            anchorEl={anchorRef.current}
            sx={{ width: 'max-content' }}
          >
            <List>
              <ListItemButton
                sx={{
                  ':hover': {
                    backgroundColor: '#FDEAF4',
                  },
                  m: '6px',
                  borderRadius: '4px',
                }}
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  onClick={downloadListCusstomer}
                >
                  <Typography
                    ml={1}
                    fontSize={'14px'}
                    fontWeight={400}
                    color={theme.palette.common.black}
                  >
                    Tải danh sách khách hàng
                  </Typography>
                </Box>
              </ListItemButton>
            </List>
          </MenuPopover>
        </Box>
        <ListComisstions />
      </Box>
    </Fragment>
  );
}
