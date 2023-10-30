import { Box, useTheme, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';

import { checkPermissionExist } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';

import { useProfile } from 'app/hooks';

import ListComisstions from './components/list';

export function Comisstion() {
  const theme = useTheme();
  const { t } = useTranslation();
  const userInfo = useProfile();
  const navigate = useNavigate();
  const redirectToCreatePage = () => navigate(path.uploadComisstion);
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
            {t(translations.sidebar.transListDetail)}
          </Typography>
          <CustomButton
            title={t(translations.common.createAccount)}
            isHide={
              !checkPermissionExist(
                PermissionKeyEnum.TRANSACTION_IMPORT,
                userInfo,
              )
            }
            isIcon
            buttonMode={'create'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
              mb: '20px',
            }}
            handleClick={redirectToCreatePage}
          />
        </Box>
        <ListComisstions />
      </Box>
    </Fragment>
  );
}
