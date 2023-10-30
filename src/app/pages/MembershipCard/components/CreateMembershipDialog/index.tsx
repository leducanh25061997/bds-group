import React from 'react';
import { Box, Dialog, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import deleteIcon from 'assets/background/close-icon.svg';
import CustomButton from 'app/components/Button';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  handleCancel?: () => void;
  children: React.ReactNode;
  actionName: string;
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
}

export default function CreateMembershipDialog(props: Props) {
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
        }}
      >
        <img
          src={deleteIcon}
          alt="delete-icon"
          className="cursor-pointer absolute top-4 right-4"
          onClick={handleClose}
          height={20}
          width={20}
        />
        {children}
        <Box mt={4}>
          {!hideCancelButton && (
            <CustomButton
              title={"Dóng"}
              variant="outlined"
              handleClick={handleCancel || handleClose}
              sxProps={{ borderRadius: '8px', width: { md: '126px' } }}
            />
          )}
          <CustomButton
            title={actionName || t(translations.common.save)}
            sxProps={{
              borderRadius: '8px',
              width: { md: '126px' },
              ml: '12px',
            }}
            handleClick={handleSubmit}
            light
          />
        </Box>
      </Grid>
    </Dialog>
  );
}
