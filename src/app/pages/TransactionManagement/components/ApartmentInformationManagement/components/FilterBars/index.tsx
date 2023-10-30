import { Box, Grid, FormControlLabel, Typography } from '@mui/material';
import { useLayoutsSlice } from 'app/pages/Layouts/slice';
import React, { memo, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RightBar } from 'app/components/RightBar';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import { useSalesProgramSlice } from 'app/pages/SalesProgram/slice';
import { selectSalesProgram } from 'app/pages/SalesProgram/slice/selectors';
import { useParams } from 'react-router-dom';
import { layoutsSelector } from 'app/pages/Layouts/slice/selectors';
import { PermissionKeyEnum } from 'types/Permission';
import { checkPermissionExist } from 'utils/helpers';
import { useProfile } from 'app/hooks';
import SocketManager, { EventSocket } from 'app/components/Socket';
import { selectTransactionManagement } from 'app/pages/TransactionManagement/slice/selector';
import { ColorPriority, EventSocketListen, PriorityStatus } from 'types/Enum';
import { useTransactionManagementSlice } from 'app/pages/TransactionManagement/slice';
import { ProjectTypeEnum } from 'types/Project';
import { SalesProgramItem } from 'app/pages/SalesProgram/slice/types';
import PRIORITY_FILTER_ICON from 'assets/icons/priority-filter-icon.svg';
import { PriorityFilter } from 'app/components/PriorityFilter';
import useResponsive from 'app/hooks/useResponsive';

import SelectBar from '../SelectBar';
import ViewSwitcher from '../ViewSwitcher';
import { useApartmentInformationsSlice } from '../../slice';
import { ApartmentInformationSParams } from '../../slice/types';
import { selectApartmentInformation } from '../../slice/selectors';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 20,
  height: 20,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#D6465F',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 20,
    height: 20,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#D6465F',
  },
});

const initialSaleProgramFilter = {
  page: 1,
  limit: 1000,
};

const initialFilter = {
  orgChartId: '',
  saleId: '',
  status: '',
  statusPriority: '',
  priorityScreening: '',
  isPriority: false,
};
export const FilterBars = memo(() => {
  const dispatch = useDispatch();
  const { actions } = useLayoutsSlice();
  const [checked, setChecked] = React.useState(false);
  const { actions: salesProgramActions } = useSalesProgramSlice();
  const { salesProgramManagement } = useSelector(selectSalesProgram);
  const { priorityStatus, isDetail } = useSelector(selectTransactionManagement);
  const [filter, setFilter] = useState<any>(initialFilter);
  const { id } = useParams();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const { isMultipleSelectTable } = useSelector(layoutsSelector);
  const { apartmentInformation, OrgchartManagement, filterDatatable } =
    useSelector(selectApartmentInformation);
  const [selectedValue, setSelectedValue] = React.useState<string>('');
  const [units, setUnits] = React.useState<any[]>([]);
  const [sales, setSales] = React.useState<any[]>([]);
  const userInfo = useProfile();

  const { actions: transactionManagementAction } =
    useTransactionManagementSlice();
  const setDefaultSale = useRef(false);
  const isDesktop = useResponsive('up', 'lg');

  React.useEffect(() => {
    setChecked(isMultipleSelectTable || false);
  }, [isMultipleSelectTable]);

  React.useEffect(() => {
    if (id) {
      dispatch(
        apartmentInformationsAction.setFilterDatatable({
          idProject: id,
          isPriority: false,
        }),
      );
      dispatch(apartmentInformationsAction.fetchListOrgchart(id));
      dispatch(
        salesProgramActions.fetchListSalesProgram({
          ...initialSaleProgramFilter,
          projectID: id,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  React.useEffect(() => {
    scheduleLoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDatatable]);

  const scheduleLoadData = () => {
    if (id && filterDatatable) {
      dispatch(apartmentInformationsAction.fetchDatatable(filterDatatable));
    }
  };

  const status1 = [
    {
      label: 'Trống ưu tiên',
      value: ColorPriority.WHITE,
    },
    {
      label: 'Đã ráp ưu tiên',
      value: ColorPriority.RED,
    },
    {
      label: 'Đang ráp bổ sung ưu tiên',
      value: ColorPriority.BLUE,
    },
  ];
  const [status, setStatus] = useState<any[]>([]);

  useEffect(() => {
    if (apartmentInformation?.infProject.count.length) {
      const data = apartmentInformation?.infProject.count.filter(
        item => Number(item.value) > 0,
      );
      const _status = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        _status.push({
          label: element.name,
          value: element.name,
        });
      }
      setStatus(_status);
    }
  }, [apartmentInformation]);

  useEffect(() => {
    if (OrgchartManagement && OrgchartManagement.data.length > 0) {
      const data: any[] = [];
      for (let i = 0; i < OrgchartManagement.data.length; i++) {
        data.push({
          label: OrgchartManagement.data[i].name,
          value: OrgchartManagement.data[i].id,
        });
      }
      setUnits(data);
    }
  }, [OrgchartManagement]);

  useEffect(() => {
    if (salesProgramManagement && salesProgramManagement.data.length) {
      const data: any[] = [];
      const defaultSale = salesProgramManagement.data.filter(
        (item: SalesProgramItem) => item.isDefault,
      );
      for (let i = 0; i < salesProgramManagement.data.length; i++) {
        if (salesProgramManagement.data[i].name) {
          data.push({
            label: salesProgramManagement.data[i].name,
            value: salesProgramManagement.data[i].id,
          });
        }
      }
      setSales(data);
      // no need update more after first updated
      if (setDefaultSale?.current) return;
      setDefaultSale.current = true;
      if (defaultSale.length > 0 && defaultSale[0].projectId) {
        const params: ApartmentInformationSParams = {
          idProject: defaultSale[0].projectId,
          isPriority: defaultSale[0].isPriority,
          saleId: defaultSale[0].id,
        };
        if (!defaultSale[0].isOpenSales) {
          dispatchPriorityStatus(defaultSale[0].priorityStatus);
        }
        dispatch(apartmentInformationsAction.fetchDatatable(params));
        dispatch(
          transactionManagementAction.setSettingSalesProgramId(
            defaultSale[0].id,
          ),
        );
        dispatch(apartmentInformationsAction.setFilterDatatable(params));
        setFilter(params);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesProgramManagement]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.handleShowBunble(event.target.checked));
    dispatch(
      actions.showRightBar({
        isShowRightBar: false,
        apartmentId: '',
        status: '',
      }),
    );
    setChecked(event.target.checked);
  };

  const handleFilter = (value: string, field: string) => {
    const _filter = { ...filter, [field]: value };

    if (id) {
      if (salesProgramManagement) {
        const sales = salesProgramManagement.data.filter(
          item => item.id === value || item.id === _filter.saleId,
        );
        const params: ApartmentInformationSParams = {
          idProject: id,
          isPriority: false,
        };
        if (sales.length > 0) {
          dispatch(
            transactionManagementAction.setSettingSalesProgramId(sales[0].id),
          );
          dispatchPriorityStatus(sales[0].priorityStatus);
          if (!sales[0].isOpenSales) {
            params.isPriority =
              sales[0].priorityStatus !== PriorityStatus.NOT_OPENED_PRIORITY;
            params.saleId = value;
            if (
              sales[0].priorityStatus !== PriorityStatus.NOT_OPENED_PRIORITY
            ) {
              _filter.status = '';
            } else {
              _filter.statusPriority = '';
            }
          } else {
            dispatch(transactionManagementAction.remmovePriorityStatus());
          }
        }
        dispatch(
          apartmentInformationsAction.fetchDatatable({
            ...params,
            ..._filter,
          }),
        );
        dispatch(
          apartmentInformationsAction.setFilterDatatable({
            ...params,
            ..._filter,
          }),
        );
        setFilter(_filter);
      }
    }
    dispatch(transactionManagementAction.changeView(true));
  };

  const handleRemove = (field: string) => {
    const _filter = { ...filter, [field]: '' };
    if (userInfo?.staff?.orgChart) {
      if (salesProgramManagement) {
        const defaultSale = salesProgramManagement.data.filter(
          (item: SalesProgramItem) => item.isDefault,
        );
        if (defaultSale.length > 0 && defaultSale[0].projectId) {
          const params: ApartmentInformationSParams = {
            idProject: defaultSale[0].projectId,
            isPriority: defaultSale[0].isPriority,
            saleId: defaultSale[0].id,
          };
          if (!defaultSale[0].isOpenSales) {
            dispatchPriorityStatus(defaultSale[0].priorityStatus);
          }
          dispatch(apartmentInformationsAction.fetchDatatable(params));
          dispatch(
            transactionManagementAction.setSettingSalesProgramId(
              defaultSale[0].id,
            ),
          );
          dispatch(apartmentInformationsAction.setFilterDatatable(params));
          setFilter(params);
        }
      }
    } else {
      if (field === 'saleId') {
        dispatch(transactionManagementAction.setSettingSalesProgramId(''));
      }

      if (field === 'saleId' && filter.statusPriority) {
        _filter.statusPriority = '';
      }

      setFilter(_filter);
      if (id) {
        if (salesProgramManagement) {
          const sales = salesProgramManagement.data.filter(
            item => item.id === _filter.saleId,
          );
          const params: ApartmentInformationSParams = {
            idProject: id,
            isPriority: false,
          };
          if (sales.length > 0) {
            params.isPriority =
              sales[0].priorityStatus !== PriorityStatus.NOT_OPENED_PRIORITY;
            params.saleId = _filter.saleId;
          }
          if (field === 'saleId') {
            dispatch(apartmentInformationsAction.fetchListOrgchart(id));
            dispatch(transactionManagementAction.remmovePriorityStatus());
          }

          dispatch(
            apartmentInformationsAction.fetchDatatable({
              ...params,
              ..._filter,
            }),
          );
          dispatch(
            apartmentInformationsAction.setFilterDatatable({
              ...params,
              ..._filter,
            }),
          );
        }
      }
    }
    dispatch(transactionManagementAction.changeView(true));
  };

  const dispatchPriorityStatus = (status: PriorityStatus) => {
    switch (status) {
      case PriorityStatus.OPEN_PRIORITY:
        dispatch(
          transactionManagementAction.setPriorityStatus(
            PriorityStatus.OPEN_PRIORITY,
          ),
        );
        break;
      case PriorityStatus.LOCK_PRIORITY:
        dispatch(
          transactionManagementAction.setPriorityStatus(
            PriorityStatus.LOCK_PRIORITY,
          ),
        );
        break;
      case PriorityStatus.OPEN_PRIORITY_ADDITIONAL:
        dispatch(
          transactionManagementAction.setPriorityStatus(
            PriorityStatus.OPEN_PRIORITY_ADDITIONAL,
          ),
        );
        break;
      case PriorityStatus.LOCK_PRIORITY_ADDITIONAL:
        dispatch(
          transactionManagementAction.setPriorityStatus(
            PriorityStatus.LOCK_PRIORITY_ADDITIONAL,
          ),
        );
        break;
      default:
        dispatch(
          transactionManagementAction.setPriorityStatus(
            PriorityStatus.NOT_OPENED_PRIORITY,
          ),
        );
        break;
    }
  };

  const handleClickPrioryFilter = () => {
    dispatch(
      actions.showRightBar({
        isShowPrirityFilter: true,
      }),
    );
  };

  const hadlePriorityFilter = (value: string) => {
    setSelectedValue(value);
    dispatch(
      apartmentInformationsAction.fetchDatatable({
        ...filter,
        priorityScreening: value,
      }),
    );
    dispatch(
      apartmentInformationsAction.setFilterDatatable({
        ...filter,
        priorityScreening: value,
      }),
    );
    setFilter({
      ...filter,
      priorityScreening: value,
    });
  };

  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_DATA_TABLE,
        handler: (data: any) => {
          if (data?.projectId === id) {
            scheduleLoadData();
          }
        },
      },
      {
        name: EventSocketListen.UPDATE_SALES_PROGRAM,
        handler: (data: any) => {
          if (data?.projectId === id) {
            dispatch(
              salesProgramActions.fetchListSalesProgram({
                ...initialSaleProgramFilter,
                projectID: id,
              }),
            );
          }
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterDatatable],
  );

  const renderFilter = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {selectedValue ? (
          <Box
            sx={{
              borderRadius: '50%',
              background: '#F5222D',
              width: '8px',
              height: '8px',
              position: 'absolute',
              top: '7px',
              left: '35px',
            }}
          ></Box>
        ) : null}
        <Box
          sx={{ marginLeft: '16px', display: 'flex', cursor: 'pointer' }}
          onClick={() => handleClickPrioryFilter()}
        >
          <img
            style={{ marginRight: '5px' }}
            src={PRIORITY_FILTER_ICON}
            alt="More icon nav"
          />
          <Typography>Lọc ưu tiên</Typography>
        </Box>
      </Box>
    );
  };

  const renderRightActions = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {checkPermissionExist(PermissionKeyEnum.PRODUCT_MOVE, userInfo) &&
          isDetail && (
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    '&:hover': { bgcolor: 'transparent' },
                  }}
                  disableRipple
                  checked={checked}
                  onChange={handleChange}
                  color="default"
                  checkedIcon={<BpCheckedIcon />}
                  icon={<BpIcon />}
                  inputProps={{ 'aria-label': 'Checkbox demo' }}
                />
              }
              label="Chọn hàng loạt"
            />
          )}

        {(apartmentInformation?.infProject.type === ProjectTypeEnum.GROUND ||
          priorityStatus) && (
          <ViewSwitcher
            type={
              apartmentInformation?.infProject.type || ProjectTypeEnum.APARTMENT
            }
          />
        )}
      </Box>
    );
  };
  const filterWidth = isDesktop ? '250px' : '31%';
  return (
    <>
      <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
        <SocketManager events={events} />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: isDesktop ? 'flex-start' : 'flex-end',
          }}
        >
          <Box sx={{ width: filterWidth }}>
            <SelectBar
              list={sales}
              // disable={priorityStatus ? true : false}
              handleSelected={(value: string) => handleFilter(value, 'saleId')}
              valueSelected={filter.saleId}
              placeholder="Bảng hàng gộp"
              handleRemove={() => handleRemove('saleId')}
            />
          </Box>
          {checkPermissionExist(
            PermissionKeyEnum.PRODUCT_VIEW_ALL,
            userInfo,
          ) && (
            <Box sx={{ width: filterWidth, marginLeft: '16px' }}>
              <SelectBar
                list={units}
                handleSelected={(value: string) =>
                  handleFilter(value, 'orgChartId')
                }
                valueSelected={filter.orgChartId}
                placeholder="Đơn vị bán hàng"
                handleRemove={() => handleRemove('orgChartId')}
              />
            </Box>
          )}
          {priorityStatus ? (
            <Box sx={{ width: filterWidth, marginLeft: '16px' }}>
              <SelectBar
                list={status1}
                // disable={priorityStatus ? true : false}
                handleSelected={(value: string) =>
                  handleFilter(value, 'statusPriority')
                }
                valueSelected={filter.statusPriority}
                placeholder="Trạng thái"
                handleRemove={() => handleRemove('statusPriority')}
              />
            </Box>
          ) : (
            <Box sx={{ width: filterWidth, marginLeft: '16px' }}>
              <SelectBar
                list={status}
                // disable={priorityStatus ? true : false}
                handleSelected={(value: string) =>
                  handleFilter(value, 'status')
                }
                valueSelected={filter.status}
                placeholder="Trạng thái"
                handleRemove={() => handleRemove('status')}
              />
            </Box>
          )}
          {isDesktop && renderFilter()}
        </Box>
        {isDesktop && renderRightActions()}

        <RightBar />
        <PriorityFilter
          hadlePriorityFilter={hadlePriorityFilter}
          setSelectedValue={setSelectedValue}
          selectedValue={selectedValue}
        />
      </Box>
      {!isDesktop && (
        <Box
          sx={{
            display: 'flex',
            width: 'fit-content',
            marginBottom: '10px',
            marginLeft: 'auto',
            marginRight: '16px',
          }}
        >
          {renderFilter()}
          {<Box sx={{ width: '20px' }}></Box>}
          {renderRightActions()}
        </Box>
      )}
    </>
  );
});
