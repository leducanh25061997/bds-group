import {
  useMsal
} from '@azure/msal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import path from 'app/routes/path';
import ICON_SUPPORT from 'assets/background/icon-support.svg';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LocalStorageService } from 'services';
import palette from 'styles/theme/palette';
import { AuthParams } from 'types';
import { StatusUi } from 'types/Enum';
import * as yup from 'yup';
import { useAuthSlice } from '../../slice';

interface Props {
  setStatusUi: (value: StatusUi) => void;
}

export default function Login(props: Props) {
  const { setStatusUi } = props;
  const { instance } = useMsal();
  const theme = useTheme();
  const schemaAuthLogin = yup.object().shape({
    email: yup
      .string()
      .email('Email sai định dạng')
      .required('Vui lòng nhập email'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberPass, setRememberPass] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaAuthLogin),
  });
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useAuthSlice();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const submit = (data: AuthParams) => {
    data.email = data.email.toLowerCase();
    setIsLoadingLogin(true);
    dispatch(
      actions.login(data, (data?: any) => {
        if (data.success) {
          navigate(path.potentialAccount);
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Đăng nhập thành công',
              type: 'success',
            }),
          );
        } else {
          setError('password', {
            message:
              data.response?.data?.message === 'Tài khoản của bạn đã bị khóa' ||
              data.response?.data?.message ===
                'Tài khoản của bạn đã bị khóa do đăng nhập sai quá số lần cho phép.'
                ? 'Tài khoản của bạn đã bị khóa'
                : 'Email không đúng hoặc sai mật khẩu!',
          });
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                data.response?.data?.message ||
                'Vui lòng kiểm tra lại thông tin',
              type: 'error',
            }),
          );
        }
        setIsLoadingLogin(false);
      }),
    );
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickChecbox = () => {};

  const SocialLogin = async () => {
    try {
      let { idToken } = await instance.loginPopup();
      if (idToken) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/callback/login`, {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + idToken,
          },
        });
        const user = await response.json();
        if (user) {
          console.log(user, 'user')
          LocalStorageService.set(LocalStorageService.OAUTH_TOKEN, user.accessToken);
          navigate(path.potentialAccount);
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Đăng nhập thành công',
              type: 'success',
            }),
          );
        }
        //

      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(submit)} style={{ width: 'inherit' }}>
        <Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: '#222222',
              background: theme.palette.common.white,
              p: '0px 8px 0px 8px',
              mb: '10px',
              ml: '20px',
              zIndex: 1,
              mt: '19px',
              position: 'absolute',
            }}
          >
            Email/ Số điện thoại
          </Typography>
          <TextField
            fullWidth
            autoComplete="off"
            sx={{
              mt: '31px',
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                background: theme.palette.common.white,
                color: theme.palette.common.black,
                border: '1px solid #D3D3D3',
                fontSize: '14px',
                height: '44px',
                '& input': {
                  padding: '20px',
                },
              },
              '& .MuiFormHelperText-root': {
                color: theme.palette.error.lighter,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            placeholder={'Vd 0987654321'}
            {...register('email')}
            helperText={
              errors.email && errors.email.message ? errors.email.message : ''
            }
            error={!!errors?.email?.message}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: '#222222',
              background: theme.palette.common.white,
              p: '0px 8px 0px 8px',
              mb: '10px',
              ml: '20px',
              zIndex: 1,
              mt: '32px',
              position: 'absolute',
            }}
          >
            Mật khẩu
          </Typography>
          <TextField
            fullWidth
            autoComplete="off"
            sx={{
              mt: '44px',
              '& .MuiInputBase-root': {
                background: theme.palette.common.white,
                color: theme.palette.common.black,
                border: '1px solid #D3D3D3',
                fontSize: '14px',
                height: '44px',
                '& input': {
                  padding: '20px 20px',
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
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            helperText={
              errors.password && errors.password.message
                ? errors.password.message
                : ''
            }
            error={!!errors?.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <img
                      src={
                        showPassword
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
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Checkbox
              checked={isRememberPass}
              sx={{
                '&.MuiButtonBase-root': {
                  padding: '0px',
                  color: palette.primary.button,
                  borderRadius: '4px',
                },
                '& .MuiSvgIcon-root': {
                  width: '20px',
                  height: '20px',
                },
              }}
              onChange={event => {
                setRememberPass(event.target.checked);
              }}
            />
            <Typography
              mt={'16px'}
              ml={'10px'}
              fontSize={'14px'}
              lineHeight={'17px'}
              fontWeight={400}
              color={palette.common.black}
            >
              Ghi nhớ đăng nhâp
            </Typography>
          </Box>
          {/* <Typography
            mt={'16px'}
            fontSize={'14px'}
            lineHeight={'17px'}
            fontWeight={400}
            color={palette.primary.button}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={() => setStatusUi(StatusUi.FORGOT)}
          >
            Quên mật khẩu?
          </Typography> */}
        </Box>

        <LoadingButton
          sx={{
            background: palette.primary.button,
            width: '100%',
            color: palette.common.white,
            height: '44px',
            fontWeight: 700,
            fontSize: '20px',
            mt: 3,
          }}
          variant={'contained'}
          type={'submit'}
          loading={isLoadingLogin}
        >
          Đăng nhập
        </LoadingButton>
        <Box>
          <Box sx={{ display: 'block', margin: '25px 0px' }}>
            <Typography
              sx={{
                fontSize: '15px',
                textAlign: 'center',
                borderBottom: '1px solid #7A7A7A',
                position: 'relative',
              }}
            >
              <span
                style={{
                  backgroundColor: '#F9F9FA',
                  position: 'relative',
                  top: '10px',
                  padding: '0 10px',
                }}
              >
                Hoặc
              </span>
            </Typography>
          </Box>
        </Box>
        {/* <Box mt={1}>
          <Typography sx={{ fontSize: '12px' }}>Đăng nhập bằng tài khoản của bạn trên:</Typography>
        </Box> */}
        {/* <UnauthenticatedTemplate> */}
          <LoadingButton
            sx={{
              background: 'white',
              width: '100%',
              color: palette.primary.button,
              height: '44px',
              fontSize: '16px',
              border: '1px solid #d45b7a',
              mt: 2,
              fontWeight: 400
            }}
            onClick={() => SocialLogin()}
          >
            <Icon icon="simple-icons:microsoftoffice" color={palette.primary.button} style={{ marginRight: '8px' }} />
            CTGroup Account
          </LoadingButton>
        {/* </UnauthenticatedTemplate> */}
      </form>
      <Link
        style={{
          position: 'absolute',
          bottom: '20px',
          cursor: 'pointer',
          color: '#1E1E1E',
          textDecoration: 'none',
        }}
        target="_blank"
        href="https://ctlotusctgroupvietnam.notion.site/d2a03fe46b8c4ff38b961c8322be9636?v=88f4f27a8261406fbaad7f672f0901c4&pvs=4"
      >
        <Box style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
          <img src={ICON_SUPPORT} alt="More icon nav" />
          Trung tâm hỗ trợ
        </Box>
      </Link>
    </Fragment>
  );
}
