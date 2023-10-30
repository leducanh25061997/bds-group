import React from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  Typography,
} from '@mui/material';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useDispatch } from 'react-redux';
import CHECK_ICON from 'assets/background/checkpink-icon.svg';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import CLOSE_ICON from 'assets/background/close-icon.svg';
import { PASSWORD_REGEX } from 'utils/helpers/regex';

import palette from 'styles/theme/palette';

import { useAuthSlice } from '../../pages/Auth/slice';
import CustomButton from '../Button';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit?: () => void;
  children?: React.ReactNode;
  actionName?: string;
  onForgetPassword: (value: boolean) => void;
}

interface InputForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const schemaChangePassword = yup.object().shape({
  // currentPassword: yup
  //   .string()
  //   .required('Vui lòng nhập mật khẩu')
  //   .matches(PASSWORD_REGEX, 'Mật khẩu không hợp lệ'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(PASSWORD_REGEX, 'Mật khẩu không hợp lệ'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(PASSWORD_REGEX, 'Mật khẩu không hợp lệ')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu không trùng khớp!'),
});

export default function ChangePasswordDialog(props: Props) {
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
    },
    resolver: yupResolver(schemaChangePassword),
  });

  const { isOpen, handleClose, onForgetPassword } = props;

  const onSubmit = (data: InputForm) => {
    dispatch(
      actions.changePassword(data, (responseData?: any) => {
        if (responseData.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Thay đổi mật khẩu thành công',
              type: 'success',
            }),
          );
          handleClose();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Vui lòng kiểm tra lại thông tin',
              type: 'error',
            }),
          );
          if (responseData.response?.data?.message === 'Mật khẩu không đúng') {
            setError('currentPassword', {
              type: 'error',
              message: `${responseData.response?.data?.message}!`,
            });
          }
        }
      }),
    );
  };

  const onError: SubmitErrorHandler<InputForm> = errors => {
    if (errors) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Vui lòng kiểm tra lại thông tin',
          type: 'error',
        }),
      );
    }
  };

  const forgetPasswordHandle = () => {
    onForgetPassword(true);
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
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Typography
          sx={{
            fontSize: '32px',
            fontWeight: '700',
            textAlign: 'center',
            color: palette.primary.button,
          }}
        >
          Đổi mật khẩu
        </Typography>
        <DialogContent
          sx={{
            padding: '0 24px',
            marginTop: '30px',
          }}
        >
          <Box>
            <TextFieldCustom
              label="Mật khẩu hiện tại"
              placeholder="Mật khẩu hiện tại"
              control={control}
              name="currentPassword"
              errors={errors}
              type="password"
              sxProps={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  width: '100%',
                  background: theme.palette.common.white,
                  color: theme.palette.common.black,
                  height: '44px',
                  fontSize: '14px',
                  border: `1px solid #D3D3D3`,
                  '& input': {
                    padding: '8.45px 20px',
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ mt: '15px' }}>
            <TextFieldCustom
              label="Mật khẩu mới"
              placeholder="Mật khẩu mới"
              control={control}
              name="newPassword"
              errors={errors}
              type="password"
              sxProps={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  width: '100%',
                  background: theme.palette.common.white,
                  color: theme.palette.common.black,
                  height: '44px',
                  fontSize: '14px',
                  border: `1px solid #D3D3D3`,
                  '& input': {
                    padding: '8.45px 20px',
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ mt: '15px' }}>
            <TextFieldCustom
              label="Nhập lại mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              control={control}
              name="confirmPassword"
              errors={errors}
              type="password"
              sxProps={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  width: '100%',
                  background: theme.palette.common.white,
                  color: theme.palette.common.black,
                  height: '44px',
                  fontSize: '14px',
                  border: `1px solid #D3D3D3`,
                  '& input': {
                    padding: '8.45px 20px',
                  },
                },
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '500',
              color: palette.common.black,
              marginTop: '16px',
              cursor: 'pointer',
            }}
          >
            Lưu ý: Mật khẩu phải bao gồm:
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
              Mật khẩu có ít nhất 8 ký tự
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
              Mật khẩu phải bao gồm chữ thường (a-z) và chữ in hoa (A-Z)
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
              Mật khẩu phải chứa ít nhất 1 số (0-9) hoặc ký hiệu đặc biệt
              (!@#$%^&*)
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
            title="Đổi mật khẩu"
            sxProps={{
              borderRadius: '8px',
              width: '100%',
            }}
            variant="contained"
            typeButton={'submit'}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
