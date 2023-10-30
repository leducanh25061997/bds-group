import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  useTheme
} from '@mui/material';
import React from 'react';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import CHECK_ICON from 'assets/background/checkpink-icon.svg';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import { useDispatch } from 'react-redux';
import palette from 'styles/theme/palette';

import { StaffItem } from 'types/Staff';
import { useAuthSlice } from '../../pages/Auth/slice';
import CustomButton from '../Button';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit?: () => void;
  children?: React.ReactNode;
  actionName?: string;
  staff?: StaffItem;
}

export default function PasswordDialog(props: Props) {
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();
  const { isOpen, handleClose, staff } = props;

  const onSubmit = () => {
    dispatch(
      actions.forgotPassword({staffId: staff?.id}, (responseData?: any) => {
        if (responseData.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Đặt lại mật khẩu thành công',
              type: 'success',
            }),
          );
          handleClose();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Đặt lại mật khẩu không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  return (
    <Dialog
      sx={{
        '&.MuiDialog-root': {
          backdropFilter: 'blur(0.5rem)',
        },
        '.MuiDialog-container > div': {
          maxWidth: '444px',
          width: '100%',
          borderRadius: '16px',
          background: '#FEF4FA',
          padding: '30px',
        },
      }}
      open={isOpen}
      onClose={handleClose}
    >
      <img
        src={CLOSE_ICON}
        alt="delete-icon"
        className="cursor-pointer absolute top-4 right-4"
        onClick={handleClose}
        height={26}
        width={26}
      />
      <Typography
        sx={{
          fontSize: '30px',
          fontWeight: '700',
          textAlign: 'center',
          color: palette.primary.button,
        }}
      >
        Đặt lại mật khẩu
      </Typography>
      <DialogContent
        sx={{
          padding: '0 24px',
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            color: palette.common.black,
            marginTop: '16px',
            cursor: 'pointer',
          }}
        >
          Bạn có chắc đặt lại mật khẩu cho nhân viên:
        </Typography>
        <Box sx={{ display: 'flex', mt: '10px' }}>
          <img src={CHECK_ICON} />
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: '400',
              color: theme.palette.common.black,
              ml: '8px',
            }}
          >
            Mã nhân viên: {staff?.code}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mt: '10px' }}>
          <img src={CHECK_ICON} />
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: '400',
              color: theme.palette.common.black,
              ml: '8px',
            }}
          >
            Họ & tên: {staff?.fullName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mt: '10px' }}>
          <img src={CHECK_ICON} />
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: '400',
              color: theme.palette.common.black,
              ml: '8px',
            }}
          >
            Email: {staff?.email}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: '25px',
          justifyContent: 'center',
        }}
      >
        <CustomButton
          title="Huỷ"
          sxProps={{
            borderRadius: '8px',
            width: '100%',
          }}
          variant="outlined"
          handleClick={handleClose}
        />
        <CustomButton
          title="Xác nhận"
          sxProps={{
            borderRadius: '8px',
            width: '100%',
          }}
          variant="contained"
          handleClick={onSubmit}
        />
      </DialogActions>
    </Dialog>
  );
}
