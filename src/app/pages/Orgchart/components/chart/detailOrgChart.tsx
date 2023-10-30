import {
  Avatar,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { useOrgchartSlice } from '../../slice';
import { selectOrgchart } from '../../slice/selector';
import TableStaffOrg from './tableStaffOrg';

interface Props {
  isEdit?: boolean;
}

export default function DetailOrgChart(props: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { id } = useParams();
  const { actions: OrgchartActions } = useOrgchartSlice();
  const { OrgchartDetail, isLoading } = useSelector(selectOrgchart);
  const [countStaffOrg, setCountStaffOrg] = useState(0);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/orgchart/edit/${id}`);
  };

  useEffect(() => {
    dispatch(OrgchartActions.getDetailOrgchart({ id }));
  }, []);

  const RenderKey = (key: string) => {
    return (
      <Box
        sx={{
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '24px',
          color: '#1E1E1E',
          marginTop: '22px',
        }}
      >
        {`${key} :`}
      </Box>
    );
  };

  const RenderValue = (value?: string) => {
    return (
      <Box
        sx={{
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
          color: '#1E1E1E',
          marginTop: '22px',
        }}
      >
        {`${value}`}
      </Box>
    );
  };

  return (
    <Box pb={'43px'} mt={'-10px'}>
      <Grid
        xs={12}
        sm={12}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display={'flex'} sx={{ alignItems: 'center', marginTop: 1 }}>
          <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
            <img src={BACK_ICON} onClick={handleCancel} />
          </Box>
          <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
            {`Chi tiết ${OrgchartDetail?.name}`}
          </Typography>
        </Box>
        <Stack flexDirection={'row'}>
          <CustomButton
            title={'Cập nhật'}
            sxProps={{
              background: palette.primary.button,
              color: palette.common.white,
              borderRadius: '8px',
              width: { md: '120px' },
            }}
            sxPropsText={{
              fontSize: '14px',
              fontWeight: 700,
            }}
            handleClick={handleEdit}
          />
        </Stack>
      </Grid>
      <Box
        bgcolor={theme.palette.grey[0]}
        p={'24px'}
        pb={10}
        sx={{
          marginBottom: { xs: '24px', md: '0px' },
          borderRadius: 3,
          mt: 2,
          minHeight: '80vh',
        }}
      >
        <Typography
          sx={{ fontSize: 24, color: palette.primary.darkRed, fontWeight: 700 }}
        >
          {OrgchartDetail?.name}
        </Typography>
        <Grid container spacing={1}>
          <>
            <Grid item xs={1.5} mt={1}>
              {RenderKey('Đơn vị trực thuộc')}
            </Grid>
            <Grid item xs={10.5} mt={1}>
              {RenderValue(OrgchartDetail?.parentOrgChart?.name || '--')}
            </Grid>
          </>
          <>
            <Grid item xs={1.5}>
              {RenderKey('Quản lý trực tiếp')}
            </Grid>
            <Grid item xs={10.5} marginTop={'22px'}>
              <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 36, height: 36 }}
                  // src="https://i.ibb.co/f9M2bwg/278238193-3052363221682674-5550266724405196590-n.jpg"
                />
                <Stack sx={{ alignItems: 'flex-start', ml: 1 }}>
                  <Typography
                    style={{ color: 'black', fontWeight: 700, fontSize: 16 }}
                  >
                    {OrgchartDetail?.manager?.fullName}
                  </Typography>
                  <Typography
                    style={{ color: '#7A7A7A', fontWeight: 400, fontSize: 16 }}
                  >
                    {OrgchartDetail?.manager?.position}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </>
          <>
            <Grid item xs={1.5}>
              {RenderKey('Phòng ban quản lý')}
            </Grid>
            <Grid item xs={10.5}>
              {RenderValue(OrgchartDetail?.listOrgchartName || '--')}
            </Grid>
          </>
          <>
            <Grid item xs={1.5}>
              {RenderKey('Số lượng nhân viên')}
            </Grid>
            <Grid item xs={10.5}>
              {RenderValue(`${countStaffOrg} nhân viên`)}
            </Grid>
          </>
        </Grid>
        <Divider
          sx={{ height: 1, background: '#E0E1E4', mt: '22px', mb: '22px' }}
        />
        <Typography
          sx={{
            fontSize: 20,
            color: palette.primary.darkRed,
            fontWeight: 700,
            mb: '13px',
          }}
        >
          Danh sách nhân viên trực thuộc
        </Typography>
        <TableStaffOrg listOrgchartName={OrgchartDetail?.listOrgchartName} setCountStaffOrg={setCountStaffOrg}/>
      </Box>
    </Box>
  );
}
