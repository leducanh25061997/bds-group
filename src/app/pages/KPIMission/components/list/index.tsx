import {
  Box,
  Paper,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
  styled,
  IconButton,
} from '@mui/material';
import { useFilter } from 'app/hooks';
import BACK_ICON from 'assets/background/backleft-icon.svg';
import ICON_DATE from 'assets/table/icon-filter-date.svg';
import ICON_FILTER from 'assets/table/icon-filter.svg';
import ICON_TOOLTIP_WARNING from 'assets/table/icon-tooltip-warning.svg';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilterParams, TableHeaderProps, TypeCheckBoxTable } from 'types';
import { RealEstateItem } from 'types/RealEstate';
import dayjs, { Dayjs } from 'dayjs';
import Table from 'app/components/Table';
import VisibilityIcon from '@mui/icons-material/Visibility';

// import { useRealEstateSlice } from '../../slice';
import { EllipsisText } from 'app/components/EllipsisText';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import moment from 'moment';
import { get } from 'lodash';
import { DateEnum } from 'types/Enum';
import palette from 'styles/theme/palette';

import { useKpiMissionSlice } from '../../slice';
import { selectKpiMissionState } from '../../slice/selectors';
import {
  MeasurementTimeKpi,
  PayloadGetStatisticKpi,
  TransferTextUnitKpiEnum,
  UnitKpiEnum,
} from '../../slice/types';
import FilterBar from '../Filterbar';
import HeaderKPI from '../HeaderKPI';
import ViewDetailDialog from '../viewDetailDialog';
import { CurrentFilter } from '../FilterDateRange';

interface ListRealEstateProps {
  hasCheckbox?: boolean;
  isFilterAppraised?: boolean;
  onSelectCheckbox?: (listItem: RealEstateItem[]) => void;
  listSelected?: RealEstateItem[];
  typeCheckBox?: TypeCheckBoxTable;
}

interface ViewDetailDialogProps {
  isOpen: boolean;
  rowSelect: any;
}

export default function ListMision(props: ListRealEstateProps) {
  const {
    hasCheckbox,
    onSelectCheckbox,
    listSelected,
    isFilterAppraised,
    typeCheckBox,
  } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 50,
      rangeDate: 'week',
      sortByName: 'false',
    };
  }, []);

  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [valueSelect, setValueSelect] = useState<string>('');
  const [textSearching, setTextSearching] = useState<string>('');
  const { actions: orgChartActions } = useOrgchartSlice();
  const { actions } = useKpiMissionSlice();
  const { statisticKpi, isLoading } = useSelector(selectKpiMissionState);
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const [isOpenViewDetail, setIsOpenViewDetail] =
    useState<ViewDetailDialogProps>({
      isOpen: false,
      rowSelect: null,
    });

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      const payload: PayloadGetStatisticKpi = {
        id: id || '',
        params,
      };
      fetchDataForPage(payload);
    },
    defaultFilter: initialFilter,
  });
  const dispatch = useDispatch();

  const fetchDataForPage = (payload: PayloadGetStatisticKpi) => {
    dispatch(actions.getListStatisticKpi(payload));
    dispatch(orgChartActions.fetchListOrgchart());
  };
  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
    onFilterToQueryString({
      ...filter,
      search: keyword,
      page: 1,
      sortByName: 'false',
    });
  };

  useEffect(() => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  }, [filterSelect, textSearching]);

  const dataPropertyType = useMemo(() => {
    if (OrgchartManagement) {
      const resOption: { label: string; value: string; id: string }[] = [];
      OrgchartManagement?.data.forEach((item: any) => {
        resOption.push({
          label: item.name || '',
          value: item.name || '',
          id: item.id.toString(),
        });
      });
      return resOption;
    }
    return [];
  }, [OrgchartManagement]);

  const filterList = useMemo(() => {
    return [
      {
        label: 'Loại khách hàng',
        placeholder: 'Loại khách hàng',
        options: [
          {
            label: 'Tất cả',
            value: '',
            id: '',
          },
          ...dataPropertyType,
        ],
        type: 'orgChart',
        handleSelected: (value: any) => {
          const sectorIdFilter = dataPropertyType.find(
            e => e.value === value,
          )?.id;
          setValueSelect(value);
          setFilterSelect({
            ...filterSelect,
            orgChart: sectorIdFilter ? sectorIdFilter + '' : undefined,
          });
        },
      },
      // {
      //   label: 'Mới nhất',
      //   type: 'filter',
      //   icon: ICON_FILTER,
      //   options: [
      //     {
      //       label: 'Mới nhất',
      //       value: 'asc',
      //     },
      //     {
      //       label: 'Cũ nhất',
      //       value: 'des',
      //     },
      //   ],
      //   handleSelected: (value: any) => {
      //     setFilterSelect({
      //       ...filterSelect,
      //       orderBy: value,
      //     });
      //   },
      // },
      {
        label: 'Tuần này',
        placeholder: 'DD/MM/YYYY - DD/MM/YYYY',
        options: [
          {
            label: 'Tuần trước',
            value: CurrentFilter.PREV_WEEK, // 'last_week',
            getValue: () => {
              const today = dayjs();
              const prevWeek = today.subtract(7, 'day');
              return [prevWeek.startOf('week'), prevWeek.endOf('week')];
            },
          },
          {
            label: 'Tuần này',
            value: CurrentFilter.CURRENT_WEEK, //'current_week',
            getValue: () => {
              const today = dayjs();
              return [today.startOf('week'), today.endOf('week')];
            },
          },
          {
            label: 'Tháng',
            value: CurrentFilter.MONTH, //'month',
            getValue: () => {
              const today = dayjs();
              return [today.startOf('month'), today.endOf('month')];
            },
          },
          {
            label: 'Quý',
            value: CurrentFilter.QUARTER_YEAR, //'quarter_year',
            getValue: () => {
              const today = dayjs();
              const currentMonth = today.month() + 1;
              const beginQuarterMonth = currentMonth - (currentMonth % 3) + 1;
              const endQuarterMonth = beginQuarterMonth + 2;
              return [
                dayjs(
                  `${
                    beginQuarterMonth < 10
                      ? `0${beginQuarterMonth}`
                      : beginQuarterMonth
                  }/01/${today.year()}`,
                ).startOf('month'),
                dayjs(
                  `${
                    endQuarterMonth < 10
                      ? `0${endQuarterMonth}`
                      : beginQuarterMonth
                  }/01/${today.year()}`,
                ).endOf('month'),
              ];
            },
          },
          {
            label: 'Từ - đến',
            value: CurrentFilter.DAY, //'day',
          },
        ],
        type: 'date',
        icon: ICON_DATE,
        handleSelected: (value: string | any) => {
          if (value && value?.type) {
            setFilterSelect({
              ...filterSelect,
              rangeDate: value?.type ? value?.type : 'week',
              date: `${value?.value?.[0]?.format(
                'YYYY/MM/DD',
              )} - ${value?.value?.[1]?.format('YYYY/MM/DD')}`,
            });
          } else {
            setFilterSelect({
              ...filterSelect,
              rangeDate: 'week',
              date: '',
            });
          }
        },
      },
    ];
  }, [dataPropertyType, filterSelect, textSearching]);

  const handleSelectTable = (event: any) => {
    setValueSelect(
      OrgchartManagement?.data.filter(item => item.id === event.target.value)[0]
        ?.name || '',
    );
    const sectorIdFilter = event.target.value;
    setFilterSelect({
      ...filterSelect,
      orgChart: sectorIdFilter ? sectorIdFilter + '' : undefined,
    });
  };

  const header: TableHeaderProps[] = useMemo(() => {
    const _header: TableHeaderProps[] = [];
    _header.push({
      id: 'select_project',
      label: '',
      align: 'left',
      width: 240,
      isSelect: true,
    });
    statisticKpi?.header?.forEach(item => {
      const data = moment(item, 'DD/MM');
      _header.push({
        id: item,
        label:
          // eslint-disable-next-line no-nested-ternary
          item === 'complete'
            ? '% Hoàn thành'
            : item === 'appraisal'
            ? 'Đánh giá'
            : get(DateEnum, moment(data).format('dddd')),
        subLable:
          item === 'complete' || item === 'appraisal'
            ? ''
            : moment(data).format('DD/MM'),
        width: 150,
        align: 'center',
      });
    });
    _header.push({
      id: 'actions',
      label: '',
      width: 100,
      align: 'left',
    });
    return _header;
  }, [statisticKpi]);

  const renderColor = (data: any) => {
    if (
      data?.value === 0 ||
      statisticKpi?.kpi.measurementTime !== MeasurementTimeKpi.DAY
    ) {
      return '#1E1E1E';
    } else if (
      checkFailedKPI(data?.detail) // Number(data?.value?.split('/')[0]) < Number(data?.value?.split('/')[1])
    ) {
      return '#D6465F';
    } else {
      return '#2A9F47';
    }
  };

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

  const BoxUserInfo = styled(Typography)({
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  const renderItem = (item: any, index: number) => {
    const listItem: any[] = [];
    listItem.push(
      <Box sx={{ background: '#E7F8F8', padding: '10px', borderRadius: '8px' }}>
        <BoxUserInfo
          sx={{
            color: '#007AFF',
            fontSize: '12px !important',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {item?.staff?.code} &nbsp;
          {!!item?.staffNumber && item?.staffNumber > 0 && (
            <Typography
              sx={{
                color: palette.primary.darkRed,
                fontSize: '12px !important',
                fontWeight: 500,
              }}
            >{`(${item?.staffNumber})`}</Typography>
          )}
        </BoxUserInfo>
        <BoxUserInfo sx={{ color: '#1E1E1E', fontSize: '14px !important' }}>
          {item?.staff?.fullName}
        </BoxUserInfo>
        <BoxUserInfo sx={{ color: '#7A7A7A', fontSize: '12px !important' }}>
          {item?.staff?.position}
        </BoxUserInfo>
      </Box>,
    );
    statisticKpi?.header?.forEach(data => {
      listItem.push(
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
                ? renderColorComplelte(item?.appraisal)
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
            statisticKpi.kpi.measurementTime === MeasurementTimeKpi.DAY && (
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
        </Box>,
      );
    });
    item?.staffNumber > 0 &&
      listItem.push(
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton
            sx={{ ml: 2, color: palette.primary.button }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              setIsOpenViewDetail({
                isOpen: true,
                rowSelect: item,
              });
              const payload = {
                id: id || '',
                params: {
                  ...filterSelect,
                  page: 1,
                  search: textSearching,
                  staffId: item?.staff?.id,
                },
              };
              dispatch(actions.getListDetailStatisticKpi(payload));
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </div>,
      );
    return listItem;
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

  const handleRequestSort = (event: any, property: string) => {
    onFilterToQueryString({
      ...filter,
      sortByName: filter?.sortByName === 'true' ? 'false' : 'true',
    });
  };

  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
      page,
    });
  };

  const onPageSizeChange = (take: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      take,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCloseViewDetail = () => {
    setIsOpenViewDetail({ isOpen: false, rowSelect: null });
    dispatch(actions.clearGetListDetailStatisticKpi());
  };

  return (
    <Paper
      sx={{
        width: '100%',
        background: '#F2F2F2',
      }}
    >
      <Box
        sx={{
          background: '#F2F2F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <Box display={'flex'} sx={{ alignItems: 'center' }}>
          <Box mr={'15px'} sx={{ cursor: 'pointer' }}>
            <img src={BACK_ICON} onClick={handleCancel} />
          </Box>
          <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
            {/* KPI nhập liệu khách hàng tiềm năng */}
            {statisticKpi?.kpi?.name}
          </Typography>
        </Box>
        <FilterBar
          onChangeSearchInput={handleSearchInputChange}
          placeholder={'Nhập từ khóa'}
          isFilter
          filterList={filterList}
          valueSelected={valueSelect}
        />
      </Box>
      <HeaderKPI statisticKpi={statisticKpi} filterSelect={filterSelect} />
      <Box
        sx={{ marginTop: '23px', background: '#FFFFFF', borderRadius: '20px' }}
      >
        <Table
          headers={header}
          onRequestSort={handleRequestSort}
          renderItem={renderItem}
          items={statisticKpi?.data}
          pageNumber={filter.page}
          totalElements={0}
          // sort={filter.orderBy}
          limitElement={filter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          hasCheckbox={hasCheckbox}
          onSelectCheckbox={onSelectCheckbox}
          listSelected={listSelected}
          typeCheckBox={typeCheckBox || TypeCheckBoxTable.CHECKBOX}
          setHeight={hasCheckbox ? '52vh' : ''}
          isSelect
          hidePagination
          selectList={[
            {
              label: 'Tất cả',
              value: '',
              id: '',
            },
            ...dataPropertyType,
          ]}
          handleSelectTable={handleSelectTable}
          defaultSelect={valueSelect}
          isLoading={isLoading}
        />
      </Box>
      <ViewDetailDialog
        isOpen={isOpenViewDetail.isOpen}
        handleClose={handleCloseViewDetail}
        header={header}
        valueSelect={valueSelect}
        parentItem={isOpenViewDetail.rowSelect}
      />
    </Paper>
  );
}
