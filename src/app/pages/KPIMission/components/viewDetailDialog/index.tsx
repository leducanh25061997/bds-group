import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';
import ViewFileDialog from 'app/components/ViewFileDialog';
import { useTranslation } from 'react-i18next';
import NO_DATA_ICON from 'assets/table/nodata-icon.svg';
import ICON_TOOLTIP_WARNING from 'assets/table/icon-tooltip-warning.svg';
import { translations } from 'locales/translations';
import { LoadingScreen } from 'app/components/Table';
import palette from 'styles/theme/palette';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { EllipsisText } from 'app/components/EllipsisText';
import React, { useMemo } from 'react';

import { selectKpiMissionState } from '../../slice/selectors';
import {
  MeasurementTimeKpi,
  TransferTextUnitKpiEnum,
  UnitKpiEnum,
} from '../../slice/types';

interface ViewDetailDialogProps {
  header?: any[];
  parentItem?: any;
  handleClose: () => void;
  isOpen: boolean;
  valueSelect?: any;
}
const BoxUserInfo = styled(Typography)({
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
export default function ViewDetailDialog(props: ViewDetailDialogProps) {
  const {
    isOpen = false,
    handleClose,
    header,
    parentItem,
    valueSelect,
  } = props;
  const { t } = useTranslation();
  const { statisticKpi, detailStatisticKpi } = useSelector(
    selectKpiMissionState,
  );

  const headerNoColumnAction = useMemo(() => {
    if (header && header?.length > 0) {
      const newHeader = header.slice(0, header.length - 1);
      return newHeader;
    }
    return [];
  }, [header]);

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
      '&::before': {
        backgroundColor: theme.palette.common.white,
        border: 'solid 1px #E0E1E4',
        boxShadow:
          '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
      },
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      borderRadius: '4px',
      border: 'solid 1px #E0E1E4',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow:
        '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
      fontSize: 11,
    },
  }));

  const checkFailedKPI = (listDetailKpi?: any[]) => {
    if (!listDetailKpi || listDetailKpi?.length < 1) return true;
    for (const kpi of listDetailKpi) {
      if (kpi?.count < kpi?.quantity) {
        return true;
      }
    }
    return false;
  };

  const renderColorComplelte = (data: string) => {
    if (data === 'Đạt') {
      return '#2A9F47';
    } else {
      return '#D6465F';
    }
  };

  const renderComplete = (number: Number) => {
    if (Number.isInteger(number)) {
      return number;
    } else {
      return number.toFixed(3);
    }
  };

  const renderColor = (data: any) => {
    if (
      data?.value === 0 ||
      statisticKpi?.kpi.measurementTime !== MeasurementTimeKpi.DAY
    ) {
      return '#1E1E1E';
    } else if (checkFailedKPI(data?.detail)) {
      return '#D6465F';
    } else {
      return '#2A9F47';
    }
  };

  const renderParentItem = () => {
    return (
      <TableRow sx={{ borderBottom: '1px solid #E0E1E4' }}>
        <TableCell sx={{ top: 77, p: '4px 0px' }}>
          <Box
            sx={{ background: '#E7F8F8', padding: '10px', borderRadius: '8px' }}
          >
            <BoxUserInfo
              sx={{
                color: '#007AFF',
                fontSize: '12px !important',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {parentItem?.staff?.code} &nbsp;
              {!!parentItem?.staffNumber && parentItem?.staffNumber > 0 && (
                <Typography
                  sx={{
                    color: palette.primary.darkRed,
                    fontSize: '12px !important',
                    fontWeight: 500,
                  }}
                >{`(${parentItem?.staffNumber})`}</Typography>
              )}
            </BoxUserInfo>
            <BoxUserInfo sx={{ color: '#1E1E1E', fontSize: '14px !important' }}>
              {parentItem?.staff?.fullName}
            </BoxUserInfo>
            <BoxUserInfo sx={{ color: '#7A7A7A', fontSize: '12px !important' }}>
              {parentItem?.staff?.position}
            </BoxUserInfo>
          </Box>
        </TableCell>
        {statisticKpi?.header?.map((data: any) => (
          <TableCell sx={{ top: 77 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <EllipsisText
                text={
                  // eslint-disable-next-line no-nested-ternary
                  data === 'complete'
                    ? renderComplete(parentItem?.[data] || 0) + '%'
                    : data === 'appraisal'
                    ? parentItem?.[data]
                    : parentItem?.[data]?.value || '-/-'
                }
                color={
                  // eslint-disable-next-line no-nested-ternary
                  data === 'complete'
                    ? renderColorComplelte(data)
                    : data === 'appraisal'
                    ? '#1E1E1E'
                    : renderColor(parentItem?.[data])
                }
                fontWeight={data === 'complete' ? 700 : 400}
                line={1}
                sx={{
                  mr: '5px',
                }}
              />
              {parentItem?.[data]?.detail &&
                checkFailedKPI(parentItem?.[data]?.detail) &&
                statisticKpi?.kpi?.measurementTime ===
                  MeasurementTimeKpi.DAY && (
                  <LightTooltip
                    title={
                      <React.Fragment>
                        <Box sx={{ padding: '5px 9px', fontWeight: 400 }}>
                          {parentItem?.[data]?.detail?.map(
                            (
                              e: {
                                count: number;
                                quantity: number;
                                unit: UnitKpiEnum;
                              },
                              i: number,
                            ) => (
                              <Box key={i} sx={{ display: 'flex' }}>
                                <Typography
                                  sx={{
                                    color:
                                      e?.count >= e?.quantity
                                        ? '#2A9F47'
                                        : '#D6465F',
                                    mr: '4px',
                                    minWidth: '30px',
                                  }}
                                >
                                  {`${e?.count}/${e?.quantity}`}
                                </Typography>
                                &nbsp;
                                <Typography>
                                  {get(TransferTextUnitKpiEnum, e?.unit)}
                                </Typography>
                              </Box>
                            ),
                          )}
                        </Box>
                      </React.Fragment>
                    }
                    arrow
                    placement="top"
                  >
                    <img src={ICON_TOOLTIP_WARNING} alt="" />
                  </LightTooltip>
                )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderItemDetailStatistic = (item: any, key: any) => {
    return (
      <TableRow sx={{ ml: '11px' }}>
        <TableCell sx={{ p: '8px 0px 4px 11px' }}>
          <Box
            sx={{ background: '#ECECEE', padding: '10px', borderRadius: '8px' }}
          >
            <BoxUserInfo
              sx={{
                color: '#007AFF',
                fontSize: '12px !important',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {item?.staff?.code}
            </BoxUserInfo>
            <BoxUserInfo sx={{ color: '#1E1E1E', fontSize: '14px !important' }}>
              {item?.staff?.fullName}
            </BoxUserInfo>
            <BoxUserInfo sx={{ color: '#7A7A7A', fontSize: '12px !important' }}>
              {item?.staff?.position}
            </BoxUserInfo>
          </Box>
        </TableCell>
        {detailStatisticKpi?.header?.map((data: any) => (
          <TableCell>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <EllipsisText
                text={
                  // eslint-disable-next-line no-nested-ternary
                  data === 'complete'
                    ? renderComplete(item?.[data] || 0) + '%'
                    : data === 'appraisal'
                    ? item?.[data]
                    : item?.[data]?.value || '-/-'
                }
                color={
                  // eslint-disable-next-line no-nested-ternary
                  data === 'complete'
                    ? renderColorComplelte(data)
                    : data === 'appraisal'
                    ? '#1E1E1E'
                    : renderColor(item?.[data])
                }
                fontWeight={data === 'complete' ? 700 : 400}
                line={1}
                sx={{
                  mr: '5px',
                }}
              />
              {item?.[data]?.detail &&
                checkFailedKPI(item?.[data]?.detail) &&
                statisticKpi?.kpi?.measurementTime ===
                  MeasurementTimeKpi.DAY && (
                  <LightTooltip
                    title={
                      <React.Fragment>
                        <Box sx={{ padding: '5px 9px', fontWeight: 400 }}>
                          {item?.[data]?.detail?.map(
                            (
                              e: {
                                count: number;
                                quantity: number;
                                unit: UnitKpiEnum;
                              },
                              i: number,
                            ) => (
                              <Box key={i} sx={{ display: 'flex' }}>
                                <Typography
                                  sx={{
                                    color:
                                      e?.count >= e?.quantity
                                        ? '#2A9F47'
                                        : '#D6465F',
                                    mr: '4px',
                                    minWidth: '30px',
                                  }}
                                >
                                  {`${e?.count}/${e?.quantity}`}
                                </Typography>
                                &nbsp;
                                <Typography>
                                  {get(TransferTextUnitKpiEnum, e?.unit)}
                                </Typography>
                              </Box>
                            ),
                          )}
                        </Box>
                      </React.Fragment>
                    }
                    arrow
                    placement="top"
                  >
                    <img src={ICON_TOOLTIP_WARNING} alt="" />
                  </LightTooltip>
                )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    );
  };
  return (
    <ViewFileDialog
      isOpen={isOpen}
      handleClose={handleClose}
      title={'Chi tiết tiến độ KPI'}
    >
      <TableContainer
        sx={{
          maxHeight: '62vh',
        }}
      >
        {detailStatisticKpi ? (
          <>
            {detailStatisticKpi?.data &&
            detailStatisticKpi?.data?.length > 0 ? (
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {headerNoColumnAction?.map((item, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          minWidth: item.width,
                          background: palette.primary.barList,
                          color: palette.primary.text,
                          whiteSpace: item.hasNotWrap ? 'nowrap' : 'normal',
                          zIndex: item.position && 999,
                          left: item.left || 0,
                          fontSize: '14px',
                          fontWeight: '600px',
                          borderBottom: 0,
                        }}
                        align={item.align}
                        width="100px"
                      >
                        {item?.isSelect ? valueSelect || 'Tất cả' : item?.label}
                        {item.subLable && (
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#7A7A7A',
                            }}
                          >
                            {item.subLable}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderParentItem()}
                </TableHead>

                <TableBody
                  sx={{
                    borderRadius: '8px',
                    background: '#F4F5F6',
                    // mt: '8px',
                    // overflowY: 'auto',
                  }}
                >
                  {detailStatisticKpi?.data?.map((row: any, indexRow: number) =>
                    renderItemDetailStatistic(row, `${indexRow}_table-row`),
                  )}
                </TableBody>
              </Table>
            ) : (
              <Box
                width="100%"
                sx={{
                  padding: '100px 0',
                }}
                // height={'calc(75vh - 92.08px)'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'column'}
              >
                <img alt="No data" src={NO_DATA_ICON} />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: '20px',
                  }}
                >
                  <Typography
                    ml={'16px'}
                    fontSize={'14px'}
                    fontWeight={'400'}
                    lineHeight={'28px'}
                  >
                    {t(translations.common.nodata)}
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <LoadingScreen>
            <img
              src="/static/loader/spinner.svg"
              alt=""
              width={100}
              height={100}
            />
          </LoadingScreen>
        )}
      </TableContainer>
    </ViewFileDialog>
  );
}
