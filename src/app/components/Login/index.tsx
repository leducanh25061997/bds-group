import { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { EMAIL_REGEX } from 'utils/helpers/regex';
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Button,
  styled,
  Box,
} from '@mui/material';
import { AuthParams } from 'types';

export const RootStyle = styled('div')({
  '& .MuiFilledInput-root': {
    borderRadius: '8px',
    background: '#F6F8FC',
  },
  '& .MuiFilledInput-root:after': {
    right: 'unset',
    border: '1px solid  #005FC5',
    height: '100%',
    width: '100%',
    borderRadius: '8px',
  },
  '& .MuiFilledInput-root.Mui-error:after': {
    border: '1px solid  #FF4842',
    borderRadius: '8px',
  },
  '& .MuiFilledInput-root:before': {
    right: 'unset',
    content: '""',
  },
  '& .MuiFormControl-root:after': {
    border: '1px solid  #005FC5',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '0px',
  },
});
interface Props {
  onSubmit: (values: AuthParams) => void;
  error?: any;
  onClearError?: () => void;
}

const authSchema = Yup.object()
  .shape({
    email: Yup.string()
      .required('Vui lòng nhập email')
      .email('Sai định dạng email!'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  })
  .required();

export default function LoginForm(props: Props) {
  const { onSubmit, error, onClearError } = props;
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    getValues,
    control,
    setError,
    clearErrors,
  } = useForm<AuthParams>({ resolver: yupResolver(authSchema), mode: 'all' });
  const [isDisableButtonLogin, setIsdisableButtonLogin] =
    useState<boolean>(true);

  const handleShowPassword = useCallback(() => {
    setShowPassword(show => !show);
  }, []);

  const checkFullData = () => {
    if (getValues('email') && !EMAIL_REGEX.test(getValues('email'))) {
      setIsdisableButtonLogin(true);
      setError('email', { message: 'Sai định dạng email!' });
      return;
    }
    if (getValues('email') && getValues('password')) {
      setIsdisableButtonLogin(false);
    } else {
      setIsdisableButtonLogin(true);
    }
  };

  return (
    <RootStyle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  fullWidth
                  variant="filled"
                  placeholder={'Email'}
                  label={'Email'}
                  error={!!errors?.email || error?.error === 'invalid_user'}
                  helperText={errors?.email?.message}
                  onChange={e => {
                    if (
                      e.target.value &&
                      getValues('password') &&
                      EMAIL_REGEX.test(e.target.value)
                    ) {
                      setIsdisableButtonLogin(false);
                    }
                    field.onChange(e);
                    clearErrors('email');
                    onClearError && onClearError();
                  }}
                  onBlur={(e: any) => {
                    field.onChange(
                      e.target.value
                        .replace(/^\s+|\s+$/g, '')
                        .replace(/\s+/g, ' '),
                    );
                    checkFullData();
                  }}
                />
              );
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  fullWidth
                  variant="filled"
                  placeholder={'Mật khẩu'}
                  type={showPassword ? 'text' : 'password'}
                  label={'Mật khẩu'}
                  error={
                    !!errors.password || error?.error === 'invalid_password'
                  }
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          <img
                            src={
                              showPassword
                                ? '/static/icons/eye-off.svg'
                                : '/static/icons/eye.svg'
                            }
                            alt=""
                            width={22}
                            height={22}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={e => {
                    if (e.target.value && getValues('email')) {
                      setIsdisableButtonLogin(false);
                    }
                    field.onChange(e);
                    onClearError && onClearError();
                  }}
                  onBlur={checkFullData}
                />
              );
            }}
          />
        </Stack>
        <Box
          sx={{
            mt: 2,
            '& a': {
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '20px',
              color: '#005FC5',
              textDecoration: 'none',
            },
          }}
        >
          <Link
            component={RouterLink}
            variant="subtitle2"
            to="#"
            className="link-forgot-password"
          >
            {'Quên mật khẩu?'}
          </Link>
        </Box>
        <Button
          type="submit"
          fullWidth
          disabled={isDisableButtonLogin}
          sx={{
            backgroundColor: isDisableButtonLogin ? '#EAECEF' : '#F8BC20',
            color: '#FFFFFF',
            mt: 5,
            padding: '10px 0',
            fontWeight: '700',
            fontSize: '20px',
            '&:hover': {
              backgroundColor: '#F8BC20',
            },
          }}
        >
          Đăng Nhập
        </Button>
      </form>
    </RootStyle>
  );
}
