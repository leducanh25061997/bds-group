import { Box, Typography } from '@mui/material';
import NODATA_ICON from 'assets/table/nodata-icon.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const RenderNoValue = () => {
  const { t } = useTranslation();

  return (
    <Box
      width="100%"
      height={'calc(75vh - 92.08px)'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <img alt="No data" src={NODATA_ICON} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: '20px',
        }}
      >
        <Typography
          ml={'16px'}
          fontSize={'14px'}
          fontWeight={'400'}
          lineHeight={'28px'}
        >
          {t(translations.common.nodata)}
        </Typography>
      </Box>
    </Box>
  );
};
