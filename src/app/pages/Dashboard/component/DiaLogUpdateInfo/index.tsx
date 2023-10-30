import { Dialog, Box, useTheme, Typography } from '@mui/material';
import CustomButton from 'app/components/Button';
import { translations } from 'locales/translations';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface DiaLogProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}
const DialogUpdateInfo: FC<DiaLogProps> = ({
  isOpen,
  handleClose,
  handleSubmit,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{
        padding: '42px 27px 33px 27px',
        textAlign: 'center',
        '&.MuiDialog-root': {
          backdropFilter: 'blur(0.5rem)',
        },
        '.MuiDialog-container > div': {
          maxWidth: '520px',
          width: '100%',
          height: '188px',
          borderRadius: '0px',
        },
      }}
    >
      <Box sx={{ padding: '42px 27px 33px 27px' }}>
        <Typography
          fontSize={'14px'}
          fontWeight={700}
          lineHeight={'28px'}
          color={theme.palette.primary.light}
        >
          {t(translations.common.contents)}
        </Typography>
        <Box sx={{ marginTop: '22px', textAlign: 'center' }}>
          <CustomButton
            title={t(translations.common.update)}
            variant="contained"
            light
            handleClick={handleSubmit}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default DialogUpdateInfo;
