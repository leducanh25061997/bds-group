import React from 'react';
import { Box, Dialog, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import deleteIcon from 'assets/background/close-icon.svg';
import deleteIconRegisterAdvise from 'assets/background/delete-icon-register-advise.svg';
import CustomButton from 'app/components/Button';
import palette from 'styles/theme/palette';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
  children: React.ReactNode;
  actionName: string;
  actionComfirm?: string;
  backgroundColor?: string;
  textColor?: string;
  isRegisterAdvise?: boolean;
}

export default function ComfirmTabDialog(props: Props) {
  const {
    isOpen,
    backgroundColor,
    handleClose,
    handleSubmit,
    handleCancel,
    children,
    actionName,
    actionComfirm,
    textColor,
    isRegisterAdvise,
  } = props;
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Grid
        sx={{
          height: 'max-content',
          padding: '25px 45px 25px 45px',
          minWidth: { md: '596px' },
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: { backgroundColor },
        }}
      >
        {isRegisterAdvise && (
          <img
            src={deleteIconRegisterAdvise}
            alt="delete-icon"
            className="cursor-pointer absolute top-4 right-4"
            onClick={handleClose}
            height={20}
            width={20}
          />
        )}

        {!isRegisterAdvise && (
          <img
            src={deleteIcon}
            alt="delete-icon"
            className="cursor-pointer absolute top-4 right-4"
            onClick={handleClose}
            height={20}
            width={20}
          />
        )}

        <Typography
          fontWeight={700}
          fontSize={'24px'}
          color={textColor ? textColor : palette.common.black}
          mb={2}
        >
          {actionName}
        </Typography>
        {children}
        <Box mt={4}>
          {!isRegisterAdvise && (
            <CustomButton
              title={t(translations.common.cancel)}
              variant="outlined"
              handleClick={handleCancel || handleClose}
              sxProps={{ borderRadius: '8px', width: { md: '126px' } }}
            />
          )}
          <CustomButton
            title={actionComfirm || t(translations.common.save)}
            sxProps={{
              borderRadius: '8px',
              minWidth: { md: '126px' },
              ml: '12px',
              width: isRegisterAdvise ? '300px' : '',
            }}
            handleClick={handleSubmit}
            light
          />
        </Box>
      </Grid>
    </Dialog>
  );
}
