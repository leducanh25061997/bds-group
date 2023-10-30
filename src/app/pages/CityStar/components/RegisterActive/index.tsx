import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import ICON_WARNING from 'assets/background/ic-warning.svg';
import ICON_HOTLINE from 'assets/background/ic_hotline.svg';
import CT_BG from 'assets/background/welcome-citystar.svg';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';

import path from 'app/routes/path';
import palette from 'styles/theme/palette';
import { Gender, HOTLINE, TYPEIdentification, TypeCardEnum } from 'types/Enum';
import {
  RenderTitleGender,
  RenderTitleMembershipCard,
  RenderTitleMembershipCardColor,
  formatDateTime2,
  renderIdentifier,
} from 'utils/helpers';

import { useCityStarSlice } from '../../slice';
import { selectCityStar } from '../../slice/selector';
import { PayloadCheckExistCode } from '../../slice/types';

export default function RegisterActive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { actions } = useCityStarSlice();
  const { membershipActiveDetail } = useSelector(selectCityStar);

  useEffect(() => {
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
            width: '25%',
            top: '10px',
          }}
        />
        <Box
          sx={{
            background: '#FEF4FA',
            borderRadius: '12px',
            zIndex: 100,
            position: 'relative',
            p: '20px 30px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '43vw',
            mt: '150px',
          }}
        >
          <Stack alignItems={'center'}>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: '32px',
                color: palette.primary.button,
              }}
            >
              Kích hoạt thẻ thành công
            </Typography>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: '30px',
                color: RenderTitleMembershipCardColor(
                  membershipActiveDetail?.typeCard || TypeCardEnum.SIVER,
                ),
                mb: 1.5,
              }}
            >
              Thẻ{' '}
              {RenderTitleMembershipCard(
                membershipActiveDetail?.typeCard || TypeCardEnum.SIVER,
              )}
            </Typography>
            <Typography
              sx={{ color: palette.common.black, lineHeight: '10px' }}
            >
              Hạn sử dụng: {formatDateTime2(membershipActiveDetail?.expiryDate)}
            </Typography>
          </Stack>
          <Stack
            sx={{
              background: palette.common.white,
              p: '20px 40px',
              borderRadius: '12px',
              mt: 3,
            }}
          >
            <Box display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Khách hàng:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {membershipActiveDetail?.customer?.name}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Giới tính:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {RenderTitleGender(
                  membershipActiveDetail?.customer?.gender || Gender.MALE,
                )}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Ngày sinh:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {formatDateTime2(membershipActiveDetail?.customer?.birth)}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Địa chỉ Email:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {membershipActiveDetail?.customer?.email}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Số điện thoại:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {membershipActiveDetail?.customer?.phoneNumber}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                {renderIdentifier(
                  membershipActiveDetail?.customer?.typeIdentification ||
                    TYPEIdentification.CITIZEN_IDENTIFICATION,
                )}{' '}
                số:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {membershipActiveDetail?.customer?.identityNumber}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Ngày cấp:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {formatDateTime2(membershipActiveDetail?.customer?.dateRange)}
              </Typography>
            </Box>
            <Box mt={2} display={'flex'}>
              <Typography
                sx={{
                  color: palette.common.black,
                  fontWeight: 700,
                }}
              >
                Nơi cấp:
              </Typography>
              <Typography
                sx={{
                  color: palette.common.black,
                  ml: '4px',
                }}
              >
                {membershipActiveDetail?.customer?.issuedBy}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack flexDirection={'row'} mt={4}>
          <Typography
            sx={{ color: palette.common.black, fontSize: '14px', ml: '4px' }}
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
        <Stack flexDirection={'row'} mt={2} mb={5}>
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
