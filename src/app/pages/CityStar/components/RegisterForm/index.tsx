import { LoadingButton } from '@mui/lab';
import {
  Box,
  Radio,
  Stack,
  Typography,
  useTheme,
  Link as MuiLink,
} from '@mui/material';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import ICON_WARNING from 'assets/background/ic-warning.svg';
import ICON_HOTLINE from 'assets/background/ic_hotline.svg';
import CT_BG from 'assets/background/welcome-citystar.svg';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FilterParams } from 'types';
import TextFieldCustom from 'app/components/TextFieldCustom';
import path from 'app/routes/path';
import documentService from 'services/api/document';
import palette from 'styles/theme/palette';
import { Gender, HOTLINE, TYPEIdentification } from 'types/Enum';
import { Province } from 'types/User';
import { renderIdentifier } from 'utils/helpers';

import { useCityStarSlice } from '../../slice';
import {
  PayloadActiveMembership,
  PayloadCheckExistCode,
} from '../../slice/types';
import { selectCityStar } from '../../slice/selector';

export default function RegisterForm() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paramsFilter, setParamsFilter] = useState<FilterParams>({
    key: 'province',
    province: '0',
    district: '0',
  });

  const {
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions } = useCityStarSlice();
  const { membershipDetail } = useSelector(selectCityStar);

  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [listIssuedby, setListIssuedby] = useState<Province[]>([]);
  const [isMale, setIsMale] = useState(Gender.MALE);
  const [isIdentifier, setIsIdentifier] = useState(
    TYPEIdentification.CITIZEN_IDENTIFICATION,
  );

  useEffect(() => {
    getProvinces();
    checkExistCode();
  }, []);

  const checkExistCode = () => {
    const payloadCheckExist: PayloadCheckExistCode = {
      customerCode: id,
    };
    dispatch(
      actions.checkCustomerExist(payloadCheckExist, (err?: any) => {
        if (err?.success) {
          dispatch(actions.getDetailMembershipActive({ id }));
        } else {
          navigate(path.creataCityStarMembrship, { replace: true });
        }
      }),
    );
  };

  useEffect(() => {
    reset({
      name: membershipDetail?.name,
      birth: membershipDetail?.birth,
      email: membershipDetail?.email,
      phoneNumber: membershipDetail?.phoneNumber,
      dateRange: membershipDetail?.dateRange,
      issuedBy: membershipDetail?.issuedBy,
      identityNumber: membershipDetail?.identityNumber,
    });
    setIsMale(membershipDetail?.gender || Gender.MALE);
    setIsIdentifier(
      membershipDetail?.typeIdentification ||
        TYPEIdentification.CITIZEN_IDENTIFICATION,
    );
  }, [
    membershipDetail?.name,
    membershipDetail?.birth,
    membershipDetail?.email,
    membershipDetail?.phoneNumber,
    membershipDetail?.dateRange,
    membershipDetail?.issuedBy,
    membershipDetail?.identityNumber,
    reset,
  ]);

  const handleChangeIdentifier = (type: TYPEIdentification) => {
    setIsIdentifier(type);
  };

  const submit = (data: PayloadActiveMembership) => {
    setIsLoadingLogin(true);
    const payloadActiveMembership = {
      ...data,
      gender: isMale,
      typeIdentification: isIdentifier,
      customerCode: id,
    };
    dispatch(
      actions.activeMembership(payloadActiveMembership, (err?: any) => {
        if (err?.success) {
          navigate(`/citystar/membership-active/${id}`, { replace: true });
        } else {
          const message = err?.response?.data?.message;
          dispatch(
            snackbarActions.updateSnackbar({
              message: message || 'Kích hoạt thẻ không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
    setIsLoadingLogin(false);
  };

  const handleChangeMale = (gender: Gender) => {
    setIsMale(gender);
  };

  const getProvinces = async () => {
    const data = await documentService.getProvince(paramsFilter);
    const newData: Province[] = [];
    data.forEach(item => {
      newData.push({
        id: +Date.now(),
        key: item,
        value: item,
      });
    });
    const item: Province[] = [
      {
        id: +Date.now(),
        key: 'Cục quản lý trật tự xã hội',
        value: 'Cục quản lý trật tự xã hội',
      },
    ];

    setListIssuedby(item.concat(newData));
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={CT_BG}
          alt="icon table"
          style={{
            position: 'absolute',
            zIndex: 1,
            width: '390px',
            top: '10px',
          }}
        />
        <form onSubmit={handleSubmit(submit)}>
          <Box
            sx={{
              width: { xs: '100%' },
              background: '#FEF4FA',
              borderRadius: '12px',
              mt: '150px',
              zIndex: 100,
              position: 'relative',
              p: '10px 30px 20px 30px',
            }}
          >
            <Stack alignItems={'center'}>
              <Typography
                fontWeight={700}
                sx={{ fontSize: '25px', color: palette.primary.button }}
              >
                Chào mừng bạn đến với CT Star
              </Typography>
              <Typography
                sx={{ color: palette.common.black, fontSize: '14px' }}
              >
                Vui lòng nhập đầy đủ thông tin dưới đây để tiến hành kích hoạt
                thẻ thành viên CT Star của bạn
              </Typography>
              <Typography sx={{ color: '#E42B2C', fontSize: '14px' }}>
                *Lưu ý: Các thông tin nhập phải chính xác để đảm bảo quyền lợi
                của bạn nhé.
              </Typography>
              <Typography
                sx={{ color: palette.common.black, fontSize: '14px' }}
              >
                Xem chi tiết Quyền lợi thành viên CTStar{' '}
                <MuiLink
                  component={Link}
                  to={path.termCondition}
                  sx={{
                    color: '#006EE6',
                  }}
                >
                  tại đây
                </MuiLink>
                !
              </Typography>
            </Stack>

            <Box mt={2}>
              <TextFieldCustom
                placeholder="Nhập họ & tên"
                label="Họ & Tên"
                isRequired
                name="name"
                control={control}
                errors={errors}
                setError={setError}
              />
            </Box>

            <Stack sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
              <Box mt={2} mr={'16px'} sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextFieldCustom
                  placeholder="Chọn ngày"
                  label="Ngày sinh"
                  isRequired
                  name="birth"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', md: '50%' },
                  mt: 2,
                  pl: { xs: '0', md: 3 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Radio
                    checked={isMale === Gender.MALE}
                    onChange={() => handleChangeMale(Gender.MALE)}
                    sx={{
                      color: palette.primary.button,
                      '&.Mui-checked': {
                        color: palette.primary.button,
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: theme.palette.common.black,
                    }}
                  >
                    Nam
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }} ml={5}>
                  <Radio
                    checked={isMale === Gender.FEMALE}
                    onChange={() => handleChangeMale(Gender.FEMALE)}
                    sx={{
                      color: palette.primary.button,
                      '&.Mui-checked': {
                        color: palette.primary.button,
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: theme.palette.common.black,
                    }}
                  >
                    Nữ
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Stack sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
              <Box mt={2} mr={'16px'} sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextFieldCustom
                  placeholder="Nhập địa chỉ email"
                  label="Địa chỉ Email"
                  isRequired
                  name="email"
                  format="email"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
              <Box mt={2} sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextFieldCustom
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  isRequired
                  name="phoneNumber"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
            </Stack>
            <Typography
              fontSize={'16px'}
              fontWeight={600}
              mt={1}
              color={theme.palette.common.black}
            >
              Thông tin pháp nhân
            </Typography>

            <Stack sx={{ mt: 1, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', md: '33%' },
                }}
              >
                <Radio
                  checked={
                    isIdentifier === TYPEIdentification.CITIZEN_IDENTIFICATION
                  }
                  onChange={() =>
                    handleChangeIdentifier(
                      TYPEIdentification.CITIZEN_IDENTIFICATION,
                    )
                  }
                  sx={{
                    color: palette.primary.button,
                    '&.Mui-checked': {
                      color: palette.primary.button,
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: theme.palette.common.black,
                  }}
                >
                  Căn cước công dân
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', md: '33%' },
                }}
              >
                <Radio
                  checked={isIdentifier === TYPEIdentification.IDENTITY_CARD}
                  onChange={() =>
                    handleChangeIdentifier(TYPEIdentification.IDENTITY_CARD)
                  }
                  sx={{
                    color: palette.primary.button,
                    '&.Mui-checked': {
                      color: palette.primary.button,
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: theme.palette.common.black,
                  }}
                >
                  Chứng minh nhân dân
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '100%', md: '33%' },
                }}
              >
                <Radio
                  checked={isIdentifier === TYPEIdentification.PASSPORT}
                  onChange={() =>
                    handleChangeIdentifier(TYPEIdentification.PASSPORT)
                  }
                  sx={{
                    color: palette.primary.button,
                    '&.Mui-checked': {
                      color: palette.primary.button,
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: theme.palette.common.black,
                  }}
                >
                  Passport
                </Typography>
              </Box>
            </Stack>
            <Stack sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
              <Box mt={2} mr={2} sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextFieldCustom
                  placeholder={`Nhập số ${renderIdentifier(isIdentifier)}`}
                  label={`Số ${renderIdentifier(isIdentifier)}`}
                  name="identityNumber"
                  isRequired
                  format={isIdentifier}
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
              <Box mt={2} sx={{ width: { xs: '100%', md: '50%' } }}>
                <TextFieldCustom
                  label="Ngày cấp"
                  placeholder="Chọn ngày cấp"
                  isRequired
                  name="dateRange"
                  type="date"
                  control={control}
                  errors={errors}
                  setError={setError}
                />
              </Box>
            </Stack>
            <Box mt={2}>
              <TextFieldCustom
                placeholder="Chọn nơi cấp"
                label="Nơi cấp"
                type="select"
                isRequired
                options={listIssuedby}
                name="issuedBy"
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
                loading={isLoadingLogin}
              >
                Kích hoạt thẻ
              </LoadingButton>
            </Stack>
          </Box>
        </form>
        <Stack flexDirection={'row'} mt={1} mb={5}>
          <img src={ICON_WARNING} alt="icon warning" />
          <Typography
            sx={{ color: palette.common.black, fontSize: '14px', ml: '4px' }}
          >
            Mọi thông tin chi tiết hoặc sự cố, vui lòng liên hệ hotline để được
            hỗ trợ.
          </Typography>
        </Stack>
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
