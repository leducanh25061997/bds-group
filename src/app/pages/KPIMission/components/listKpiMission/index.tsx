import { useFilter } from 'app/hooks';
import { Fragment, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterParams, TableHeaderProps } from 'types';
import { useTranslation } from 'react-i18next';
import { EllipsisText } from 'app/components/EllipsisText';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import RECEIVE_ICON from 'assets/background/icon_receive.svg';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Table from 'app/components/Table';
import palette from 'styles/theme/palette';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getLocalTime } from 'utils/helpers';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';

import { useKpiMissionSlice } from '../../slice';
import {
  MissionAssignedItem,
  TransferTextMeasurementTimeKpi,
  TransferTextStatus,
  TransferTextTypeKpiEnum,
  TransferTextUnitKpiEnum,
} from '../../slice/types';
import { selectKpiMissionState } from '../../slice/selectors';

interface ListKpiMissionProps {
  isAssigned?: boolean;
}
export default function ListKpiMission(props: ListKpiMissionProps) {
  const { isAssigned } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t } = useTranslation();
  const { actions } = useKpiMissionSlice();
  const { missionAssignManager, isLoading } = useSelector(
    selectKpiMissionState,
  );
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      status: isAssigned ? 'assigned' : 'created',
    };
  }, [isAssigned]);

  useEffect(() => {
    return () => {
      dispatch(actions.clearListMissionAssigned());
    };
  }, []);
  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage({
        ...params,
        status: isAssigned ? 'assigned' : 'created',
      });
    },
    defaultFilter: initialFilter,
  });
  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListMissionAssigned(params));
  };
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Mã nhiệm vụ',
        align: 'left',
        width: 200,
      },
      {
        id: 'misionName',
        label: 'Tên nhiệm vụ',
        align: 'left',
        width: 200,
      },
      {
        id: 'missionType',
        label: 'Loại',
        width: 150,
        align: 'left',
      },
      {
        id: 'assigner',
        label: 'Người giao chỉ tiêu',
        width: 200,
        align: 'left',
      },
      {
        id: 'position',
        label: 'Chức vụ',
        width: 200,
        align: 'left',
      },
      {
        id: 'kpiAchieved',
        label: 'Số lượng đạt',
        width: 200,
        align: 'left',
      },
      {
        id: 'unitOfMeasure',
        label: 'Đơn vị đo',
        width: 200,
        align: 'left',
      },
      {
        id: 'time',
        label: 'Thời gian đo',
        width: 200,
        align: 'left',
      },
      {
        id: 'timeApply',
        label: 'Thời gian áp dụng',
        width: 250,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Tình trạng',
        width: 200,
        align: 'left',
      },
      {
        id: 'statusAplly',
        label: 'Trạng thái',
        width: 200,
        align: 'left',
      },
      {
        id: 'options',
        label: '',
        width: 100,
        align: 'left',
      },
    ],
    [t],
  );
  const renderItem = (item: MissionAssignedItem, index: number) => {
    return [
      <EllipsisText
        text={`${item?.code}`}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          event.stopPropagation();
          navigate(`/kpi-mission/edit/${item.id}`, {
            state: {
              tabActive: isAssigned ? 0 : 1,
            },
          });
        }}
      />,
      <EllipsisText text={`${item?.name || ''}`} line={2} />,
      <EllipsisText
        text={`${item?.type ? get(TransferTextTypeKpiEnum, item?.type) : ''}`}
        line={1}
      />,
      <EllipsisText text={`${item?.creator?.fullName ?? ''}`} line={1} />,
      <EllipsisText text={`${item?.creator?.position ?? ''}`} line={1} />,
      <EllipsisText
        text={`${
          item?.kpiPerformance
            ? item?.kpiPerformance.reduce((prev, e) => prev + e?.quantity, 0)
            : ''
        }`}
        line={1}
      />,
      <EllipsisText
        text={`${
          item?.kpiPerformance
            ? item?.kpiPerformance
                .map(e => get(TransferTextUnitKpiEnum, e.unit))
                .join(', ')
            : ''
        }`}
        line={2}
      />,
      <EllipsisText
        text={`${
          item?.measurementTime
            ? get(TransferTextMeasurementTimeKpi, item?.measurementTime)
            : ''
        }`}
        line={1}
      />,
      <EllipsisText
        text={`${
          item?.startTime && item?.endTime
            ? `${getLocalTime(item?.startTime, 'DD/MM/YYYY')} - ${getLocalTime(
                item?.endTime,
                'DD/MM/YYYY',
              )}`
            : ''
        }`}
        line={2}
      />,
      <EllipsisText
        text={`${
          item?.status != null && item?.status !== undefined
            ? get(TransferTextStatus, item?.status?.toString())
            : ''
        }`}
        line={1}
        color={item?.status ? '#2FB350' : '#D6465F'}
      />,
      <EllipsisText
        text={`${!item.processingStatus ? 'Chưa xử lý' : 'Đã xử lý'}`}
        line={1}
      />,
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* {isAssigned ? ( */}
        <Tooltip
          title={
            item.processingStatus || !isAssigned ? 'Chỉnh sửa' : 'Tiếp nhận'
          }
        >
          <IconButton
            sx={{ ml: 2 }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              if (item.processingStatus || !isAssigned) {
                navigate(`/kpi-mission/edit/${item.id}`, {
                  state: {
                    tabActive: isAssigned ? 0 : 1,
                  },
                });
              } else {
                const payload = {
                  id: item.id,
                };
                dispatch(
                  actions.getHandleKpiMission(payload, (err?: any) => {
                    if (err.success) {
                      dispatch(
                        snackbarActions.updateSnackbar({
                          message: 'Tiếp nhận thành công',
                          type: 'success',
                        }),
                      );
                      setTimeout(() => {
                        dispatch(
                          actions.fetchListMissionAssigned({ ...filter }),
                        );
                      }, 500);
                    }
                  }),
                );
              }
            }}
          >
            <img
              alt="edit icon"
              src={
                item.processingStatus || !isAssigned ? EDIT_ICON : RECEIVE_ICON
              }
            />
          </IconButton>
        </Tooltip>
        {/* ) : (
          <Tooltip title="Chỉnh sửa">
            <IconButton
              sx={{ ml: 2 }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                navigate(`/kpi-mission/edit/${item.id}`, {
                  state: {
                    tabActive: isAssigned ? 0 : 1,
                  },
                });
              }}
            >
              <img alt="edit icon" src={EDIT_ICON} />
            </IconButton>
          </Tooltip>
        )} */}
        <IconButton
          sx={{ ml: 2, color: palette.primary.button }}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            navigate(`/kpi/${item.id}`);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </div>,
    ];
  };
  const onPageChange = (page: number) => {
    onFilterToQueryString({
      ...filter,
      page,
    });
  };

  const onPageSizeChange = (limit: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      limit,
    });
  };
  return (
    <Fragment>
      <Table
        headers={header}
        renderItem={renderItem}
        items={missionAssignManager?.data}
        pageNumber={filter.page}
        totalElements={missionAssignManager?.total}
        sort={filter.orderBy}
        limitElement={filter.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
    </Fragment>
  );
}
