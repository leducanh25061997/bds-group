import { Box, Grid, Typography, useTheme } from '@mui/material';
import path from 'app/routes/path';
import { translations } from 'locales/translations';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { URL_DASHBROARD } from 'utils/config';

export function Dashboard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const breadCrumbList = useMemo(() => {
    return [
      {
        label: t(translations.sidebar.dashboard),
        path: path.dashboards,
        isActive: true,
      },
    ];
  }, [t]);

  return (
    <Fragment>
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
        {/* <Grid
          xs={12}
          sm={12}
          sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
        >
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
              {'Dashboard'}
            </Typography>
          </Box>
        </Grid> */}
        <iframe
          src={URL_DASHBROARD}
          style={{ width: '100%', height: '100vh' }}
        />
      </Box>
    </Fragment>
  );
}
