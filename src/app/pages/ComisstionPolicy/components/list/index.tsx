import { Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import ConfirmDialog from 'app/components/ConfirmDialog';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useFilter } from 'app/hooks';
import useTabs from 'app/hooks/useTabs';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import { translations } from 'locales/translations';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { FilterParams, TableHeaderProps } from 'types';
import { AccountType, Status } from 'types/Enum';

import RenderStatus from 'app/components/RenderStatus';
import { ComisstionPolicy } from 'types/Comisstion';
import { formatDateTime2 } from 'utils/helpers';

import { useComisstionPolicySlice } from '../../slice';
import { selectComisstion } from '../../slice/selector';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ListComisstions() {
  const { actions } = useComisstionPolicySlice();
  const navigate = useNavigate();
  const theme = useTheme();
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { ComisstionManagement, ComisstionManagementInactive, isLoading } =
    useSelector(selectComisstion);

  const { handleTabChange, activeTab } = useTabs(0);

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      checkStatus: true,
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<Status>(Status.INACTIVE);
  const [userSelected, setUserSelected] = useState<string | number>(0);
  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Mã chính sách',
        align: 'left',
        width: 130,
      },
      {
        id: 'rule_name',
        label: 'Tên chính sách',
        align: 'left',
        width: 140,
      },
      {
        id: 'date_create',
        label: 'Ngày tạo',
        width: 110,
        align: 'left',
      },
      {
        id: 'date_start',
        label: 'Ngày bắt đầu',
        width: 130,
        align: 'left',
      },
      {
        id: 'date_end',
        label: 'Ngày kết thúc',
        width: 130,
        align: 'left',
      },
      {
        id: 'project',
        label: 'Dự án',
        width: 120,
        align: 'left',
      },
      {
        id: 'sales',
        label: 'Đơn vị bán hàng',
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Trạng thái',
        width: 110,
        align: 'left',
      },
      {
        id: 'userUuid',
        label: '',
        width: 70,
        align: 'left',
      },
    ],
    [t],
  );

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListComisstion(params));
    dispatch(actions.fetchListComisstionInactive(params));
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

  const onPageSizeChange = (limit: number) => {
    onFilterToQueryString({
      ...filter,
      page: 1,
      limit,
    });
  };

  const handleSubmitDialog = () => {
    const payload = {
      id: userSelected,
      status: dialogType,
    };
    dispatch(
      actions.updateStatusComisstion(payload, (err?: any) => {
        if (err?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                dialogType === Status.ACTIVE
                  ? t(translations.common.unlockedAccount)
                  : t(translations.common.lockedAccount),
              type: 'success',
            }),
          );
          dispatch(actions.fetchListComisstion(filter));
          handleCloseDialog();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: t(translations.common.errorOccurred),
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleEdit = (id: any) => {
    navigate(`/comisstions/comisstions-policy/${id}`);
  };

  const onSelectRow = (rowData: any) => {
    handleEdit(rowData.id);
  };

  const handleChangeStatus = () => {};

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const renderItem = (item: ComisstionPolicy, index: number) => {
    return [
      <EllipsisText text={`${item?.code}`} line={1} color={'#007AFF'} />,
      <EllipsisText text={`${item?.name}`} line={1} />,
      <EllipsisText text={`${formatDateTime2(item.createdAt)}`} line={1} />,
      <EllipsisText text={`${formatDateTime2(item.startDate)}`} line={1} />,
      <EllipsisText text={`${formatDateTime2(item.endDate)}`} line={1} />,
      <EllipsisText text={`${item?.project?.name}`} line={1} />,
      <EllipsisText text={`${item?.orgChartNames}`} line={2} />,
      <RenderStatus
        status={item.CheckStatus ? Status.ACTIVE : Status.INACTIVE}
      />,
      <div>
        <img src={EDIT_ICON} />
      </div>,
    ];
  };

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
    onFilterToQueryString({
      ...filter,
      search: keyword,
      page: 1,
      fields: keyword ? ['fullName', 'staffCode'] : [],
    });
  };
  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const filterListPhase = useMemo(() => {
    return [
      {
        label: 'Đợt chi',
        options: [
          {
            label: 'Chọn đợt chi',
            value: '',
          },
          {
            label: 'Đợt 1',
            value: Status.APPRAISED,
          },
          {
            label: 'Đợt 2',
            value: Status.ACTIVE,
          },
          {
            label: 'Đợt 3',
            value: Status.INACTIVE,
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            status: value,
            fields: textSearching ? ['fullName', 'staffCode'] : [],
          });
        },
      },
    ];
  }, [filterSelect, textSearching]);

  const filterList = useMemo(() => {
    return [
      {
        label: 'Dự án',
        options: [
          {
            label: 'Chọn dự án',
            value: '',
          },
          {
            label: 'MetroStart',
            value: AccountType.Staff,
          },
          {
            label: 'Deyas sky',
            value: AccountType.Manager1,
          },
        ],
        handleSelected: (value: string) => {
          setFilterSelect({
            ...filterSelect,
            staffType: value,
            fields: textSearching ? ['fullName', 'staffCode'] : [],
          });
        },
      },
    ];
  }, [filterSelect, textSearching]);

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          '& .MuiTab-root.Mui-selected': {
            color: theme.palette.common.black,
          },
        }}
        TabIndicatorProps={{
          style: {
            backgroundColor: palette.primary.button,
          },
        }}
      >
        <Tab label="CSHH hiện tại" />
        <Tab label="CSHH vô hiệu" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Table
          headers={header}
          onRequestSort={handleRequestSort}
          renderItem={renderItem}
          items={ComisstionManagement?.data}
          pageNumber={filter.page}
          totalElements={ComisstionManagement?.total}
          sort={filter.orderBy}
          limitElement={filter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          dataType={'Comisstionrules'}
          onSelectRow={onSelectRow}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Table
          headers={header}
          onRequestSort={handleRequestSort}
          renderItem={renderItem}
          items={ComisstionManagementInactive?.data}
          pageNumber={filter.page}
          totalElements={ComisstionManagementInactive?.total}
          sort={filter.orderBy}
          limitElement={filter.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          dataType={'Comisstionrules'}
          onSelectRow={onSelectRow}
        />
      </TabPanel>

      {isOpenDialog && (
        <ConfirmDialog
          isOpen={isOpenDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleSubmitDialog}
          actionName={
            dialogType === Status.ACTIVE
              ? t(translations.common.unlock)
              : t(translations.common.lock)
          }
        >
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            color={theme.palette.primary.light}
            mb={5}
          >
            {dialogType === Status.ACTIVE
              ? t(translations.confirmMessage.unlock)
              : t(translations.confirmMessage.lock)}
          </Typography>
        </ConfirmDialog>
      )}
    </Paper>
  );
}
