import { Box, Typography, useTheme } from '@mui/material';
import { translations } from 'locales/translations';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';

export function Settings() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          }}
        >
          <Typography
            fontSize={'20px'}
            fontWeight={'700'}
            color={palette.primary.text}
          >
            {t(translations.sidebar.permission)}
          </Typography>
        </Box>
      </Box>
    </Fragment>
  );
}
