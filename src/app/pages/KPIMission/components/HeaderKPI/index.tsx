import { Box, Grid, Typography } from '@mui/material';
import RATE_GROWN from 'assets/background/rate-grown-icon.svg';
import RATE_LOW from 'assets/background/rate-low-icon.svg';

import { FilterParams } from 'types';

import { StatisticKpiItem, TypeKpiEnum } from '../../slice/types';
import { CurrentFilter } from '../FilterDateRange';

interface Props {
  statisticKpi?: StatisticKpiItem;
  filterSelect?: FilterParams;
}

export default function HeaderKPI(props: Props) {
  const { statisticKpi, filterSelect } = props;

  const renderIncrease = () => {
    if (filterSelect?.rangeDate === CurrentFilter.MONTH) {
      return 'so với tháng trước';
    } else if (filterSelect?.rangeDate === CurrentFilter.QUARTER_YEAR) {
      return 'so với quý trước';
    } else if (filterSelect?.rangeDate === 'week') {
      return 'so với tuần trước';
    } else {
      return 'so với ngày trước';
    }
  };

  return (
    <>
      <Grid container xs={12} md={12} sx={{ background: '#F2F2F2' }}>
        <Grid item xs={3} md={3}>
          <Box
            sx={{
              background: 'white',
              height: { md: '100px', xs: '130px' },
              borderRadius: '12px',
              mr: '8px',
            }}
          >
            <Box
              sx={{
                height: { md: '100px', xs: '130px' },
                width: '16px',
                background: '#66AFFF',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px',
                position: 'absolute',
              }}
            />
            <Box sx={{ p: '12px 30px' }}>
              <Typography fontSize={'12px'} color={'black'}>
                Tổng nhân viên
              </Typography>
              <Typography fontWeight={700} fontSize={'24px'} color={'black'}>
                {statisticKpi?.statistic.totalStaff?.value}
              </Typography>
              <Box display={'flex'} alignItems={'center'}>
                {statisticKpi?.statistic.totalStaff?.increase &&
                statisticKpi?.statistic.totalStaff?.increase < 0 ? (
                  <img src={RATE_LOW} />
                ) : (
                  <img src={RATE_GROWN} />
                )}
                <Typography
                  fontWeight={500}
                  fontSize={'14px'}
                  color={
                    statisticKpi?.statistic.totalStaff?.increase &&
                    statisticKpi?.statistic.totalStaff?.increase < 0
                      ? '#D6465F'
                      : '#2A9F47'
                  }
                  m={'0px 4px'}
                >
                  {Math.abs(statisticKpi?.statistic.totalStaff?.increase || 0)}%
                </Typography>
                <Typography
                  fontStyle={'italic'}
                  fontSize={'12px'}
                  color={'#AFAFAF'}
                >
                  {renderIncrease()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3} md={3}>
          <Box
            sx={{
              background: 'white',
              height: { md: '100px', xs: '130px' },
              borderRadius: '12px',
              m: '0px 8px',
            }}
          >
            <Box
              sx={{
                height: { md: '100px', xs: '130px' },
                width: '16px',
                background: '#E6B800',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px',
                position: 'absolute',
              }}
            />
            <Box sx={{ p: '12px 30px' }}>
              <Typography fontSize={'12px'} color={'black'}>
                {statisticKpi?.kpi?.type === TypeKpiEnum.REVENUE
                  ? 'Số tiền khách hàng thanh toán'
                  : `Hồ sơ khách hàng đã nhập`}
              </Typography>
              <Typography fontWeight={700} fontSize={'24px'} color={'black'}>
                {(
                  statisticKpi?.statistic.totalTicket?.value || 0
                ).toLocaleString()}
              </Typography>
              <Box display={'flex'} alignItems={'center'}>
                {statisticKpi?.statistic.totalTicket?.increase &&
                statisticKpi?.statistic.totalTicket?.increase < 0 ? (
                  <img src={RATE_LOW} />
                ) : (
                  <img src={RATE_GROWN} />
                )}
                <Typography
                  fontWeight={500}
                  fontSize={'14px'}
                  color={
                    statisticKpi?.statistic.totalTicket?.increase &&
                    statisticKpi?.statistic.totalTicket?.increase < 0
                      ? '#D6465F'
                      : '#2A9F47'
                  }
                  m={'0px 4px'}
                >
                  {Math.abs(statisticKpi?.statistic.totalTicket?.increase || 0)}
                  %
                </Typography>
                <Typography
                  fontStyle={'italic'}
                  fontSize={'12px'}
                  color={'#AFAFAF'}
                >
                  {renderIncrease()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3} md={3}>
          <Box
            sx={{
              background: 'white',
              height: { md: '100px', xs: '130px' },
              borderRadius: '12px',
              m: '0px 8px',
            }}
          >
            <Box
              sx={{
                height: { md: '100px', xs: '130px' },
                width: '16px',
                background: '#2AC8C8',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px',
                position: 'absolute',
              }}
            />
            <Box sx={{ p: '12px 30px' }}>
              <Typography fontSize={'12px'} color={'black'}>
                Nhân viên đạt chỉ tiêu
              </Typography>
              <Box display={'flex'} alignItems={'center'}>
                <Typography
                  fontWeight={700}
                  fontSize={'24px'}
                  color={'#2A9F47'}
                >
                  {(
                    statisticKpi?.statistic.achieveTargets?.value || 0
                  ).toLocaleString()}
                </Typography>
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  color={'black'}
                  ml="8px"
                >
                  ({statisticKpi?.statistic.achieveTargets?.percent}%)
                </Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                {statisticKpi?.statistic.achieveTargets?.increase &&
                statisticKpi?.statistic.achieveTargets?.increase < 0 ? (
                  <img src={RATE_LOW} />
                ) : (
                  <img src={RATE_GROWN} />
                )}
                <Typography
                  fontWeight={500}
                  fontSize={'14px'}
                  color={
                    statisticKpi?.statistic.achieveTargets?.increase &&
                    statisticKpi?.statistic.achieveTargets?.increase < 0
                      ? '#D6465F'
                      : '#2A9F47'
                  }
                  m={'0px 4px'}
                >
                  {Math.abs(
                    statisticKpi?.statistic.achieveTargets?.increase || 0,
                  )}
                  %
                </Typography>
                <Typography
                  fontStyle={'italic'}
                  fontSize={'12px'}
                  color={'#AFAFAF'}
                >
                  {renderIncrease()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3} md={3}>
          <Box
            sx={{
              background: 'white',
              height: { md: '100px', xs: '130px' },
              borderRadius: '12px',
              ml: '8px',
            }}
          >
            <Box
              sx={{
                height: { md: '100px', xs: '130px' },
                width: '16px',
                background: '#EF7197',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px',
                position: 'absolute',
              }}
            />
            <Box sx={{ p: '12px 30px' }}>
              <Typography fontSize={'12px'} color={'black'}>
                Nhân viên không đạt chỉ tiêu
              </Typography>
              <Box display={'flex'} alignItems={'center'}>
                <Typography
                  fontWeight={700}
                  fontSize={'24px'}
                  color={'#D6465F'}
                >
                  {(
                    statisticKpi?.statistic.failTargets?.value || 0
                  ).toLocaleString()}
                </Typography>
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  color={'black'}
                  ml="8px"
                >
                  ({statisticKpi?.statistic.failTargets?.percent}%)
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'}>
                {statisticKpi?.statistic.failTargets?.increase &&
                statisticKpi?.statistic.failTargets?.increase < 0 ? (
                  <img src={RATE_LOW} />
                ) : (
                  <img src={RATE_GROWN} />
                )}
                <Typography
                  fontWeight={500}
                  fontSize={'14px'}
                  color={
                    statisticKpi?.statistic.failTargets?.increase &&
                    statisticKpi?.statistic.failTargets?.increase < 0
                      ? '#D6465F'
                      : '#2A9F47'
                  }
                  m={'0px 4px'}
                >
                  {Math.abs(statisticKpi?.statistic.failTargets?.increase || 0)}
                  %
                </Typography>
                <Typography
                  fontStyle={'italic'}
                  fontSize={'12px'}
                  color={'#AFAFAF'}
                >
                  {renderIncrease()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
