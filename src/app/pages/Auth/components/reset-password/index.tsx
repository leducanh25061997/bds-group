import React, { Fragment, useState } from 'react';
import { StatusUi } from 'types/Enum';
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { UpdatePassword } from 'types';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useSearchParams } from 'react-router-dom';

import { useAuthSlice } from '../../slice';

interface Props {
  setStatusUi: (value: StatusUi) => void;
  statusUi: StatusUi;
}

export default function ResetPassword(props: Props) {
  const { setStatusUi, statusUi } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const theme = useTheme();
  const schema = yup.object().shape({
    newPassword: yup.string().required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: yup
      .string()
      .required('Vui lòng nhập lại mật khẩu mới')
      .oneOf([yup.ref('newPassword')], 'Mật khẩu không trùng khớp'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { actions: snackbarActions } = useSnackbarSlice();
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();
  const [isLoading, setIsLoading] = useState(false);

  const submit = (data: UpdatePassword) => {
    setIsLoading(true);
    data.token = searchParams?.get('token') || '';
    dispatch(
      actions.resetPassword(data, (response?: any) => {
        if (response.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Thay đổi mật khẩu thành công',
              type: 'success',
            }),
          );
          setStatusUi(StatusUi.RESET_SUCCESS);
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Vui lòng kiểm tra lại thông tin',
              type: 'error',
            }),
          );
        }
        setIsLoading(false);
      }),
    );
  };

  const handleShowPassword = (check: 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [check]: !showPassword[check],
    });
  };

  return (
    <Fragment>
      {statusUi === StatusUi.RESET_PASSWORD ? (
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            fullWidth
            sx={{
              mt: '31px',
              '& .MuiInputBase-root': {
                borderRadius: '0px',
                background: '#f2f6ff',
                color: theme.palette.primary.light,
                fontSize: '14px',
                '& input': {
                  padding: '23px 20px',
                },
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.error.lighter,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            placeholder={'Mật khẩu mới'}
            {...register('newPassword')}
            helperText={
              errors.newPassword && errors.newPassword.message
                ? errors.newPassword.message
                : ''
            }
            type={showPassword.new ? 'text' : 'password'}
            error={!!errors?.newPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleShowPassword('new')}>
                    <img
                      src={
                        showPassword.new
                          ? '/static/icons/show-pass-icon.svg'
                          : '/static/icons/hide-pass-icon.svg'
                      }
                      alt=""
                      width={22}
                      height={22}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            sx={{
              mt: 2,
              '& .MuiInputBase-root': {
                borderRadius: '0px',
                background: '#f2f6ff',
                color: theme.palette.primary.light,
                fontSize: '14px',
                '& input': {
                  padding: '23px 20px',
                },
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.error.lighter,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            placeholder={'Mật khẩu'}
            type={showPassword.confirm ? 'text' : 'password'}
            {...register('confirmPassword')}
            helperText={
              errors.confirmPassword && errors.confirmPassword.message
                ? errors.confirmPassword.message
                : ''
            }
            error={!!errors?.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleShowPassword('confirm')}>
                    <img
                      src={
                        showPassword.confirm
                          ? '/static/icons/show-pass-icon.svg'
                          : '/static/icons/hide-pass-icon.svg'
                      }
                      alt=""
                      width={22}
                      height={22}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            mt={2}
            fontSize="14px"
            color={theme.palette.primary.light}
          >
            Mật khẩu phải có 8 ký tự bao gồm 1 chữ cái viết hoa, 1 ký tự đặc
            biệt và ký tự chữ và số.
          </Typography>
          <LoadingButton
            sx={{
              bgColor: theme.palette.primary.lighter,
              width: '100%',
              color: theme.palette.grey[0],
              py: '20px',
              mt: 5,
            }}
            variant={'contained'}
            type={'submit'}
            loading={isLoading}
          >
            Cập nhật
          </LoadingButton>
        </form>
      ) : (
        <Fragment>
          <Typography
            mt={2}
            fontSize="14px"
            color={theme.palette.primary.light}
          >
            Mật khẩu tài khoản của bạn đã được thay đổi thành công. Xin vui lòng
            đăng nhập lại!
          </Typography>
          <LoadingButton
            sx={{
              bgColor: theme.palette.primary.lighter,
              width: '100%',
              color: theme.palette.grey[0],
              py: '20px',
              mt: 5,
            }}
            variant={'contained'}
            onClick={() => setStatusUi(StatusUi.LOGIN)}
            loading={isLoading}
          >
            Đăng nhập
          </LoadingButton>
        </Fragment>
      )}
    </Fragment>
  );
}
