import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { debounce } from 'lodash';
import useTabs from 'app/hooks/useTabs';
import TextFieldCustom from 'app/components/TextFieldCustom';
import { useForm } from 'react-hook-form';
import { ProjectTypeEnum } from 'types/Project';
import useResponsive from 'app/hooks/useResponsive';

import { useProjectSlice } from '../Projects/slice';
import { selectProject } from '../Projects/slice/selector';
import { useGroundProductTableSlice } from '../GroundProductTable/slice';

import { ApartmentInformationManagement } from './components/ApartmentInformationManagement';
import { FilterBars } from './components/ApartmentInformationManagement/components/FilterBars';
import { Footer } from './components/ApartmentInformationManagement/components/Footer';
import { FilterBarTransactionManagement } from './components/FilterBarTransactionManagement';

import ListDeposit from './components/listDeposit';

import ReservationManagement from './components/reservationManagement';
import { useTransactionManagementSlice } from './slice';
import { useApartmentInformationsSlice } from './components/ApartmentInformationManagement/slice';
import ListCanceled from './components/canceledManagement';
import { ApartmentInformationSParams } from './components/ApartmentInformationManagement/slice/types';

import { RenderPriorityStatus } from './components/RenderPriorityStatus';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StateLocationProps {
  tabActive?: number;
  tickId?: string;
}

export function TransactionManagement() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useProjectSlice();
  const { actions: apartmentInformationsAction } =
    useApartmentInformationsSlice();
  const { ProjectDetail } = useSelector(selectProject);
  const theme = useTheme();
  const { state } = useLocation();
  const { actions: transactionManagementAction } =
    useTransactionManagementSlice();

  const locationProps = state as StateLocationProps;
  const { handleTabChange, activeTab, setActiveTab } = useTabs(0);
  const containerTableRef: any = useRef(null);
  const [heightTable, setHeightTable] = useState<number>(0);
  const { actions: actionsGround } = useGroundProductTableSlice();
  const isDesktop = useResponsive('up', 'lg');
  const { control, setValue } = useForm();

  useEffect(() => {
    return () => {
      dispatch(transactionManagementAction.resetPriorityStatus());
      dispatch(transactionManagementAction.updateParamsSearchKeySearch(''));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(actions.getDetailProject({ id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id && ProjectDetail) {
      const params: ApartmentInformationSParams = {
        idProject: id,
        isPriority: false,
      };
      dispatch(apartmentInformationsAction.fetchSettingTableProduct(params));
      if (ProjectDetail.type === ProjectTypeEnum.GROUND) {
        dispatch(actionsGround.getGroundProductTable({ id }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ProjectDetail]);

  useEffect(() => {
    if (locationProps?.tabActive) {
      setActiveTab(locationProps?.tabActive);
    }
    if (locationProps?.tickId) {
      dispatch(
        transactionManagementAction.getDetailBooking({
          id: locationProps?.tickId,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationProps, handleTabChange]);

  useEffect(() => {
    if (containerTableRef && containerTableRef.current) {
      const { current } = containerTableRef;
      setHeightTable(current.offsetHeight);
    }
  }, [containerTableRef]);

  const ChildrenTab = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{ height: value === 0 ? '100%' : 'unset' }}
        {...other}
      >
        {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
      </div>
    );
  };

  const handleChangeSearch = (e: any) => {
    setValue('searchInput', e);
    const searchKey = typeof e === 'string' ? e : e?.target?.value;
    switch (activeTab) {
      case 0:
        if (id) {
          dispatch(
            apartmentInformationsAction.setFilterDatatableSearchKey({
              code: searchKey,
            }),
          );
        }
        break;
      default:
        dispatch(
          transactionManagementAction.updateParamsSearchKeySearch(searchKey),
        );
        break;
    }
  };
  const debounceOnChange = debounce(handleChangeSearch, 350);

  return (
    <Box>
      {activeTab > 0 ? (
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            fontSize={'18px'}
            fontWeight={700}
            color={palette.common.black}
          >
            {ProjectDetail?.name}
          </Typography>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .MuiBox-root .MuiInputBase-root': {
                width: '222px',
                background: '#F2F2F2',
              },
            }}
          >
            <TextFieldCustom
              type="text"
              name="searchInput"
              placeholder="Nhập từ khóa"
              control={control}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              onChange={debounceOnChange}
              sxProps={{
                '& .MuiInputBase-root input': {
                  padding: 0,
                },
              }}
            />
            <FilterBarTransactionManagement
              value={activeTab}
              handleChangeSearch={() => {}}
            />
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            fontSize={'18px'}
            fontWeight={700}
            color={palette.common.black}
          >
            {ProjectDetail?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search"
              type="search"
              placeholder="Nhập từ khóa"
              sx={{ width: '222px', height: '44px' }}
              InputProps={{
                style: {
                  height: '44px',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={debounceOnChange}
            />
            <FilterBarTransactionManagement
              value={activeTab}
              handleChangeSearch={() => {}}
            />
          </Box>
        </Box>
      )}

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          background: theme.palette.grey[300],
          alignItems: 'center',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={async (event: React.SyntheticEvent, newValue: number) => {
            handleTabChange(event, newValue);
            handleChangeSearch('');
          }}
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: theme.palette.common.black,
              fontWeight: 700,
            },
            background: theme.palette.grey[300],
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: palette.primary.button,
            },
          }}
        >
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Bảng hàng"
          />
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Quản lý giữ chỗ"
          />
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Quản lý đặt cọc"
          />
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Quản lý hủy chỗ"
          />
          <Tab
            sx={{ fontSize: '16px', fontWeight: 400, textTransform: 'none' }}
            label="Rút thăm sản phẩm"
            disabled
          />
        </Tabs>
        {isDesktop && !activeTab && <RenderPriorityStatus />}
      </Paper>
      {!isDesktop && !activeTab && (
        <Box sx={{ width: 'fit-content', marginLeft: 'auto' }}>
          <RenderPriorityStatus />
        </Box>
      )}
      <Box
        ref={containerTableRef}
        sx={{
          backgroundColor: theme.palette.grey[0],
          marginTop: '8px',
          borderRadius: '20px',
          height: activeTab === 0 ? 'calc(100vh - 210px)' : 'unset',
        }}
      >
        <ChildrenTab value={activeTab} index={0}>
          <Box
            sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}
          >
            <FilterBars />
            <Box
              sx={{
                padding: `0px 24px ${
                  containerTableRef?.current?.offsetHeight > 600 ? '0' : '80px'
                } 24px`,
                maxHeight: `calc(${heightTable}px - 150px)`,
              }}
            >
              <ApartmentInformationManagement heightTable={heightTable} />
            </Box>
            <Footer />
          </Box>
        </ChildrenTab>
        <ChildrenTab value={activeTab} index={1}>
          <ReservationManagement />
        </ChildrenTab>
        <ChildrenTab value={activeTab} index={2}>
          <ListDeposit />
        </ChildrenTab>
        <ChildrenTab value={activeTab} index={3}>
          <ListCanceled />
        </ChildrenTab>
        <ChildrenTab value={activeTab} index={4}>
          <Box sx={{ p: 3 }}>Rút thăm sản phẩm</Box>
        </ChildrenTab>
      </Box>
    </Box>
  );
}
