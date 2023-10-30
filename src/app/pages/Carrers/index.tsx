import { Box, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ListRealEstate from './components/list';

export function Carrers() {
  const theme = useTheme();
  const navigate = useNavigate();
  const redirectToCreatePage = () => navigate(path.createCarrers);
  const { t } = useTranslation();
  return (
    <Fragment>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          mb: 3,
          paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
          paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
        }}
      >
        <CustomButton
          title={t(translations.common.createRealEstate)}
          isIcon
          buttonMode={'create'}
          sxProps={{
            background: theme.palette.primary.lighter,
          }}
          handleClick={redirectToCreatePage}
        />
      </Box>
      <Box
        sx={{
          marginLeft: { xs: '12px', sm: '24px', lg: '0px' },
          marginRight: { xs: '12px', sm: '24px', lg: '0px' },
        }}
        bgcolor={theme.palette.grey[0]}
        p="24px 24px 0px 24px"
      >
        <ListRealEstate />
      </Box> */}
    </Fragment>
  );
}
