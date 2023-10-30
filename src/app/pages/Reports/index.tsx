import { Box, useTheme } from '@mui/material';
import CustomButton from 'app/components/Button';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';

import ListCategory from './components/list';

export function Reports() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const redirectToCreatePage = () => navigate(path.createCategory);
  return (
    <Box
      sx={{
        paddingLeft: { xs: '12px', sm: '24px', lg: '0px' },
        paddingRight: { xs: '12px', sm: '24px', lg: '0px' },
      }}
    >
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          mb: 3,
        }}
      >
        <CustomButton
          title={t(translations.listManagement.createNew)}
          isIcon
          buttonMode={'create'}
          sxProps={{
            background: theme.palette.primary.lighter,
          }}
          handleClick={redirectToCreatePage}
        />
      </Box>
      <Box bgcolor={theme.palette.grey[0]} p={3}>
        <ListCategory />
      </Box> */}
    </Box>
  );
}
