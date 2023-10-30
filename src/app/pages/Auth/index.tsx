import { Box, Grid, Typography, useTheme } from '@mui/material';
import CTLOTUS_LOGO from 'assets/background/ctlotus-logopink.svg';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { StatusUi } from 'types/Enum';

import BURANO from 'assets/img/BURANO.svg';
import CTNGUYENHONG from 'assets/img/CTNGUYENHONG.svg';
import DIAMONDSQUARE from 'assets/img/DIAMONDSQUARE.svg';
import METROSTAR from 'assets/img/METROSTAR.svg';
import MINHCHAU from 'assets/img/MINHCHAU.svg';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import ResetPassword from './components/reset-password';
import Login from './components/login';
import Particless from './components/particles';
interface Props {
  isUpdatePassword?: boolean;
}

const ListImageBackground = [
  {
    id: 0,
    img: BURANO,
    color: '#D6465F',
  },
  {
    id: 1,
    img: CTNGUYENHONG,
    color: '#ffffff',
  },
  {
    id: 2,
    img: DIAMONDSQUARE,
    color: '#ffffff',
  },
  {
    id: 3,
    img: METROSTAR,
    color: '#ffffff',
  },
  {
    id: 4,
    img: MINHCHAU,
    color: '#D6465F',
  },
  // {
  //   id: 5,
  //   img: DEYASKY,
  //   color: '#D6465F',
  // },
];

export default function AuthPage(props: Props) {
  const { isUpdatePassword } = props;
  const theme = useTheme();
  const { instance } = useMsal();
  const [idToken, setIdToken] = useState<string>('');

  const [imageBackground, setImageBackground] = useState({
    id: 0,
    img: BURANO,
    color: '#D6465F',
  });

  useEffect(() => {
    const item =
      ListImageBackground[
        Math.floor(Math.random() * ListImageBackground.length)
      ];
    setImageBackground(item);
  }, []);

  const [statusUi, setStatusUi] = useState<StatusUi>(() => {
    if (isUpdatePassword) {
      return StatusUi.RESET_PASSWORD;
    } else {
      return StatusUi.LOGIN;
    }
  });

  const renderTitlePage = useMemo(() => {
    switch (statusUi) {
      case StatusUi.LOGIN:
        return 'ĐĂNG NHẬP TÀI KHOẢN';
      case StatusUi.FORGOT:
        return 'Quên mật khẩu';
      case StatusUi.FORGOT_SUCCESS:
        return 'Đã gửi mật khẩu';
      case StatusUi.RESET_PASSWORD:
        return 'Đặt lại mật khẩu';
      case StatusUi.RESET_SUCCESS:
        return 'Đặt lại mật khẩu';
      default:
        return '';
    }
  }, [statusUi]);
  const renderDescriptionPage = useMemo(() => {
    switch (statusUi) {
      case StatusUi.LOGIN:
        return 'Nhập thông tin đăng nhập phía dưới.';
      case StatusUi.FORGOT:
        return 'Một liên kết xác minh sẽ được gửi đến email của bạn.';
      case StatusUi.FORGOT_SUCCESS:
        return 'Một liên kết xác minh sẽ được gửi đến email của bạn.';
      case StatusUi.RESET_PASSWORD:
        return 'Cập nhật mật khẩu mới của bạn.';
      default:
        return '';
    }
  }, [statusUi]);

  // const Login = async () => {
  //   try {
  //       let {idToken} = await instance.loginPopup();
  //       setIdToken(idToken);
  //   } catch (error) {
  //       console.error(error);
  //   }
  // }


  return (
    <Fragment>
      <Box height={'100vh'}>
        <Grid container>
          <Grid
            item
            xs={12}
            lg={7}
            sx={{
              display: { xs: 'none', md: 'flex', sm: 'none' },
              flexDirection: 'column',
              height: '100vh',
              alignItems: 'center',
              backgroundImage: `url(${imageBackground.img});`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <Particless />
          </Grid>
          <Grid
            item
            xs={12}
            lg={5}
            sx={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: {
                  xs: '0px 66px',
                },
              }}
              width={'100vh'}
              height={'100vh'}
            >
              <Box display="flex" justifyContent="space-between">
                {statusUi === StatusUi.FORGOT && (
                  <Typography
                    fontSize="14px"
                    color={theme.palette.primary.lighter}
                    sx={{
                      '&:hover': {
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => setStatusUi(StatusUi.LOGIN)}
                  >
                    Quay lại
                  </Typography>
                )}
              </Box>
              <img src={CTLOTUS_LOGO} alt="logo login" />
              <Box
                sx={{
                  marginTop: { xs: '120px', md: '0px' },
                  width: '100%',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  mt={'42px'}
                  fontSize={'20px'}
                  lineHeight={'28px'}
                  fontWeight={400}
                  color={'#1E1E1E'}
                >
                  {renderTitlePage}
                </Typography>
                {statusUi === StatusUi.LOGIN && (
                  <Login setStatusUi={setStatusUi} />
                )}
                {/* <UnauthenticatedTemplate>
                  <div className="alert alert-warning" role="alert">
                    You are not authenticated 🥺
                    <button
                      type="button"
                      className="btn btn-dark btn-sm float-end"
                      onClick={() => Login()}
                    >
                      Login
                    </button>
                  </div>
                </UnauthenticatedTemplate> */}
                {(statusUi === StatusUi.RESET_PASSWORD ||
                  statusUi === StatusUi.RESET_SUCCESS) && (
                  <ResetPassword
                    setStatusUi={setStatusUi}
                    statusUi={statusUi}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
