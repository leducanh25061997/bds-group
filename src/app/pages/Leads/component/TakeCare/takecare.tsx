import {
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useFilter, useProfile } from 'app/hooks';
import { translations } from 'locales/translations';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FilterParams } from 'types';
import dayjs, { Dayjs } from 'dayjs';
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_PaginationState,
  MaterialReactTableProps,
} from 'material-react-table';
import { useLeadSlice } from '../../slice';
import { selectLeads } from '../../slice/selector';
import palette from 'styles/theme/palette';
import RECEIVE_ICON from 'assets/background/icon_receive.svg';
import FilterBar from 'app/components/Filterbar';
import { StatusTakeCare } from 'types/Enum';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { PayloadUpdateLead } from '../../slice/types';
import { renderStatusLead } from 'utils/helpers';

export default function ListCustomerPro() {
  const listStatusTakeCare = StatusTakeCare;
  const anchorRef = useRef(null);
  const { actions } = useLeadSlice();
  const { actions: snackbarActions } = useSnackbarSlice();
  const userInfo = useProfile();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { leadTakeCare } = useSelector(selectLeads);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 10,
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIdOpen] = useState<any>('');

  const handleOpenDialog = (id: any) => {
    if (id == isOpen) {
      setIdOpen('');
      return;
    }
    setIdOpen(id);
  };

  const handleCloseDialog = () => {
    setIdOpen('');
  };

  const handleClickAway = () => {
    setIdOpen('');
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        enableEditing: false,
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${renderStatusLead(cell.getValue<any>()) ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Tên khách hàng',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'email',
        header: 'Địa chỉ email',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Số điện thoại',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'source',
        header: 'Nguồn',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'mediaChannel',
        header: 'Kênh truyền thông',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'segment.type',
        header: 'Phân khúc',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'projectName',
        header: 'Dự án quan tâm',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
        enableEditing: false,
        header: 'Ngày tạo',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${dayjs(cell.getValue<Date>()).format('DD/MM/YYYY')}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'note',
        header: 'Ghi chú',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'action',
        header: 'Hành động',
        enableEditing: false,
        enableColumnActions: false,
        enableResizing: false,
        Cell: ({ row }) => {
          return row.original.status == 'NOT_RECEIVE' ? (
            <Tooltip title="Tiếp nhận">
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => handelChangeStatus(row.original, 'TAKE_CARE')}
              >
                <img src={RECEIVE_ICON} alt="icon edit" />
              </IconButton>
            </Tooltip>
          ) : (
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <Tooltip title="Đánh giá khách hàng">
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={() => handleOpenDialog(row.original.id)}
                >
                  <CheckBoxIcon fontSize="small" sx={{ color: '#2FB350' }} />
                </IconButton>
              </Tooltip>

              {isOpen == row.original.id && (
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Box
                    sx={{
                      zIndex: '1060',
                      right: '100px',
                      position: 'fixed',
                      padding: '10px',
                      background: '#fff',
                      borderRadius: '8px',
                      boxShadow:
                        '0px 5px 5px -3px rgba(145, 158, 171, 0.2), 0px 8px 10px 1px rgba(145, 158, 171, 0.14), 0px 3px 14px 2px rgba(145, 158, 171, 0.12)',
                    }}
                  >
                    {listStatusTakeCare.map(item => (
                      <Typography
                        ml={1}
                        onClick={() =>
                          handelChangeStatus(row.original, item.key)
                        }
                        style={{ padding: '6px', cursor: 'pointer' }}
                        fontSize={'14px'}
                        fontWeight={400}
                        color={theme.palette.common.black}
                      >
                        {item.name}
                      </Typography>
                    ))}
                  </Box>
                </ClickAwayListener>
              )}
            </Box>
          );
        },
      },
    ],
    [t, userInfo, isOpen],
  );

  useEffect(() => {
    return () => {
      dispatch(actions.clearListLead());
    };
  }, []);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setFilterSelect({
      ...filterSelect,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    });
    onFilterToQueryString({
      ...filter,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    });
    fetchDataForPage(filterSelect);
  }, [pagination.pageIndex, pagination.pageSize]);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListLeadTakeCare(params));
  };

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
  };

  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  const filterList = useMemo(() => {
    return [
      {
        label: 'Trạng thái',
        options: [
          {
            label: 'Chọn trạng thái',
            value: '',
          },
          {
            label: 'Chưa tiếp nhận',
            value: 'NOT_RECEIVE',
          },
          {
            label: 'Chăm sóc',
            value: 'TAKE_CARE',
          },
          {
            label: 'Lead thiện chí của dự án',
            value: 'LEAD_GOODWILL',
          },
          {
            label: 'Lead quan tâm BĐS',
            value: 'LEAD_INTERESTED',
          },
          {
            label: 'Lead đã tư vấn trực tiếp',
            value: 'LEAD_CONSULTED_DIRECTLY',
          },
          {
            label: 'Lead tiềm năng',
            value: 'LEAD_POTENTIAL',
          },
          {
            label: 'Lead ảo',
            value: 'LEAD_VITUAL',
          },
          {
            label: 'Lead không có nhu cầu',
            value: 'LEAD_NOT_INTERESTED',
          },
          {
            label: 'Lead không liên lạc được',
            value: 'LEAD_CAN_NOT_CONTACT',
          },
          {
            label: 'Lead KH lớn',
            value: 'LEAD_BIG',
          },
        ],
        handleSelected: (value: any) => {
          setFilterSelect({
            ...filterSelect,
            status: value,
          });
        },
      },
      {
        label: 'Thời gian',
        type: 'date',
        placeholder: 'Từ ngày',
        options: [],
        onChange: (value: Dayjs | null) => {
          if (value) {
            setFilterSelect({
              ...filterSelect,
              startDate: dayjs(value).format('YYYY-MM-DD'),
            });
          } else {
            delete filterSelect?.startDate;
            setFilterSelect(filterSelect);
          }
        },
      },
      {
        label: '',
        type: 'date',
        placeholder: 'Đến ngày',
        options: [],
        onChange: (value: Dayjs | null) => {
          if (value) {
            setFilterSelect({
              ...filterSelect,
              endDate: dayjs(value).format('YYYY-MM-DD'),
            });
          } else {
            delete filterSelect?.endDate;
            setFilterSelect(filterSelect);
          }
        },
      },
    ];
  }, [filterSelect]);

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      const payloadUpdate: PayloadUpdateLead = {
        name: values?.name,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        address: values?.address,
        mediaChannel: values?.mediaChannel,
        source: values?.source,
        note: values?.note,
        needShuttle: false,
        id: row?.original?.id,
      };
      setIsLoading(true);
      dispatch(
        actions.updateLead(payloadUpdate, (res?: any) => {
          if (res) {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Chỉnh sửa thành công',
                  type: 'success',
                }),
              );
              dispatch(actions.fetchListLeadTakeCare(initialFilter));
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Chỉnh sửa không thành công',
                  type: 'error',
                }),
              );
              dispatch(actions.fetchListLeadTakeCare(initialFilter));
            }
          }
        }),
      );
      setIsLoading(false);
      exitEditingMode();
    };

  const handelChangeStatus = (row: any, item: any) => {
    const payload: any = {
      id: row?.id,
      status: item,
    };

    dispatch(
      actions.updateStatus(payload, (res?: any) => {
        if (res.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật thành công',
              type: 'success',
            }),
          );
          fetchDataForPage(filterSelect);
          handleCloseDialog();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Cập nhật thất bại',
              type: 'error',
            }),
          );
        }
        fetchDataForPage(filterSelect);
        handleCloseDialog();
      }),
    );
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          fontSize={'20px'}
          fontWeight={'700'}
          color={palette.primary.text}
        >
          {'Chăm sóc lead'}
        </Typography>
      </Box>
      <FilterBar
        onChangeSearchInput={handleSearchInputChange}
        placeholder={t(translations.common.search)}
        isFilter
        filterList={filterList}
        submitFilter={submitFilter}
      />
      <Box>
        {leadTakeCare?.data ? (
          <MaterialReactTable
            columns={columns}
            data={leadTakeCare?.data}
            editingMode="row"
            enableEditing
            onEditingRowSave={handleSaveRow}
            manualPagination
            enableRowActions
            enablePinning
            initialState={{ columnPinning: { left: ['mrt-row-actions'] } }}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                header: 'Hành động',
                size: 150,
              },
            }}
            rowCount={leadTakeCare?.total}
            onPaginationChange={setPagination}
            enableStickyHeader
            enableColumnResizing
            muiTableContainerProps={{
              sx: { maxHeight: '545px', zIndex: '1001' },
            }}
            muiTableBodyCellProps={{
              sx: { padding: '8.3px 15px', zIndex: '1001' },
            }}
            muiTableHeadCellProps={{
              sx: {
                background: 'rgb(254, 244, 250)',
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                zIndex: 'unset',
              },
            }}
            state={{
              pagination,
              isLoading,
            }}
          />
        ) : (
          <p>No data available.</p>
        )}
      </Box>
    </Paper>
  );
}
