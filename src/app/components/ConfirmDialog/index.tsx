import React from 'react';
import { Box, Dialog, Grid, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
// import deleteIcon from 'assets/background/close-icon.svg';
import CloseIcon from '@mui/icons-material/Close';
import palette from 'styles/theme/palette';

import CustomButton from '../Button';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
  children: React.ReactNode;
  actionName?: string;
  actionCancel?: string;
  buttonMode?:
    | 'create'
    | 'edit'
    | 'remove'
    | 'filter'
    | 'lock'
    | 'preview'
    | 'create-click'
    | 'upload'
    | 'download'
    | 'up'
    | 'down'
    | 'expand'
    | 'collapse'
    | 'send'
    | 'setting'
    | 'unset';
  hideCancelButton?: boolean;
  isIcon?: boolean;
  maxWidth?: 'md' | 'xs' | 'sm' | 'lg' | 'xl';
}

export default function ConfirmDialog(props: Props) {
  const {
    isOpen,
    handleClose,
    handleSubmit,
    handleCancel,
    children,
    actionName,
    actionCancel,
    buttonMode,
    hideCancelButton,
    isIcon,
    maxWidth,
  } = props;
  const { t } = useTranslation();
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { borderRadius: '20px' } }}
      maxWidth={maxWidth ?? 'sm'}
    >
      <Grid
        sx={{
          height: 'max-content',
          padding: '40px 44px 24px',
        }}
      >
        <Box sx={{ position: 'absolute', top: '16px', right: '16px' }}>
          <IconButton aria-label="delete" onClick={handleClose}>
            <CloseIcon
              sx={{ width: 26, height: 26, color: palette.button.greyLighter }}
            />
          </IconButton>
        </Box>
        {children}
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          {!hideCancelButton && (
            <CustomButton
              title={actionCancel || t(translations.common.cancel)}
              variant="outlined"
              handleClick={handleCancel || handleClose}
              sxProps={{
                borderRadius: '8px',
                minWidth: { md: '128px' },
              }}
            />
          )}
          <CustomButton
            title={actionName || t(translations.common.confirm)}
            buttonMode={buttonMode || 'lock'}
            sxProps={{
              ml: 3.5,
              borderRadius: '8px',
              minWidth: { md: '128px' },
            }}
            isIcon={isIcon ?? true}
            handleClick={handleSubmit}
            light
          />
        </Box>
      </Grid>
    </Dialog>
  );
}
