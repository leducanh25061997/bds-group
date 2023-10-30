import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import ICON_HOTLINE from 'assets/background/ic_hotline.svg';
import CT_BG from 'assets/background/welcome-citystar.svg';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import TextFieldCustom from 'app/components/TextFieldCustom';
import palette from 'styles/theme/palette';
import { HOTLINE } from 'types/Enum';
import { useCityStarSlice } from '../../slice';
import { PayloadCheckExistCode } from '../../slice/types';

export default function Membership() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm();

  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useCityStarSlice();

  const submit = (data: PayloadCheckExistCode) => {
    const payloadCheckExist = {
      ...data,
    };
    dispatch(
      actions.checkCustomerExist(payloadCheckExist, (err?: any) => {
        if (err?.success) {
          if (err?.data?.isActive) {
            navigate(
              `/citystar/membership-active/${payloadCheckExist.customerCode}`,
            );
          } else {
            navigate(`/citystar/welcome/${payloadCheckExist.customerCode}`);
          }
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Mã thẻ thành viên không hợp lệ',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box
          component={'img'}
          src={CT_BG}
          alt="icon table"
          sx={{
            position: 'absolute',
            zIndex: 1,
            width: '420px',
            bottom: '45vh',
          }}
        />
        <form onSubmit={handleSubmit(submit)}>
          <Box
            sx={{
              background: '#FEF4FA',
              borderRadius: '12px',
              zIndex: 100,
              position: 'relative',
              p: '10px 30px 20px 30px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack alignItems={'center'}>
              <Typography
                fontWeight={700}
                sx={{ fontSize: '24px', color: palette.common.black }}
              >
                Nhập mã thẻ thành viên
              </Typography>
              <Typography
                sx={{ fontSize: '14px', color: palette.common.black }}
              >
                Vui lòng nhập mã thẻ thành viên của bạn để thực hiện kích hoạt
                thẻ
              </Typography>
            </Stack>

            <Box mt={2}>
              <TextFieldCustom
                placeholder="Nhập mã thẻ thành viên"
                label="Mã thẻ thành viên"
                isRequired
                format="number"
                name="customerCode"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Box>
            <Stack alignItems={'center'}>
              <LoadingButton
                sx={{
                  background: palette.primary.button,
                  color: palette.common.white,
                  height: '44px',
                  fontWeight: 700,
                  fontSize: '16px',
                  mt: 2,
                }}
                variant={'contained'}
                type={'submit'}
              >
                Tiếp tục
              </LoadingButton>
            </Stack>
          </Box>
        </form>
        <a href={`tel:+${HOTLINE.NUMBERPHONE}`}>
          <Box
            sx={{
              borderRadius: '48px',
              background: '#D45B7A',
              position: 'fixed',
              right: '36px',
              bottom: '36px',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1001,
              cursor: 'pointer',
              display: 'flex',
              p: '8px 20px',
            }}
          >
            <img src={ICON_HOTLINE} alt="add icon" />
            <Typography
              fontWeight={700}
              sx={{ fontSize: '20px', color: palette.common.white, ml: 1 }}
            >
              {HOTLINE.NUMBERPHONE}
            </Typography>
          </Box>
        </a>
      </Box>
    </Fragment>
  );
}
