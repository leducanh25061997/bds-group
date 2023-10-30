import {
  Box,
  Button,
  Grid,
  List,
  ListItemButton,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useFilter, useProfile } from 'app/hooks';
import { translations } from 'locales/translations';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FilterParams } from 'types';
import dayjs, { Dayjs } from 'dayjs';
import CustomButton from 'app/components/Button';
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MaterialReactTableProps,
} from 'material-react-table';
import { selectLeads } from '../slice/selector';
import { useLeadSlice } from '../slice';
import useTabs from 'app/hooks/useTabs';
import palette from 'styles/theme/palette';
import { checkPermissionExist, renderStatusLead } from 'utils/helpers';
import { PermissionKeyEnum } from 'types/Permission';
import MenuPopover from 'app/components/MenuPopover';
import { snackbarActions } from 'app/components/Snackbar/slice';
import document from 'services/api/document';
import { Link, useNavigate } from 'react-router-dom';
import SellectSearch from '../component/SellectSearch';
import {
  PayloadLeadAllotment,
  PayloadUpdateLead,
  PayloadUpdateLeadSegment,
} from '../slice/types';
import { CustomerGroupType, TableType } from 'types/Enum';
import { Options } from 'types/User';
import FilterBar from 'app/components/Filterbar';
import { selectProject } from 'app/pages/Projects/slice/selector';
import { useProjectSlice } from 'app/pages/Projects/slice';
import ConfirmDialog from 'app/components/ConfirmDialog';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ListCustomerPro() {
  const navigate = useNavigate();
  const { actions } = useLeadSlice();
  const { actions: actionsProject } = useProjectSlice();
  const userInfo = useProfile();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    leadManager,
    Segment,
    leadManagerTrans,
    fileImport,
    leadManagerAlloted,
  } = useSelector(selectLeads);
  const { ProjectManagement } = useSelector(selectProject);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 10,
    };
  }, []);
  const anchorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [filterSelectAllotment, setFilterSelectAllotment] =
    useState<FilterParams>(initialFilter);
  const [filterSelectAlloted, setFilterSelectAlloted] =
    useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const [textSearchingAllotment, setTextSearchingAllotment] =
    useState<string>('');
  const [textSearchingAlloted, setTextSearchingAlloted] = useState<string>('');
  const { handleTabChange, activeTab } = useTabs(0);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenDialogConfirm, setIsOpenDialogConfirm] =
    useState<boolean>(false);
  const [segValue, setSegValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState<Options[]>([
    { label: 'Chọn tập tin', value: '' },
  ]);
  const [segmentOptions, setSegmentOptions] = useState<Options[]>([
    { label: 'Chọn phân khúc', value: '' },
  ]);

  const [projectOptions, setProjectOptions] = useState<Options[]>([
    { label: 'Chọn dự án quan tâm', value: '' },
  ]);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const [rowSelectionAllotment, setRowSelectionAllotment] =
    useState<MRT_RowSelectionState>({});

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'staff.code',
        header: 'Mã NV Sale',
        enableEditing: false,
        Cell: ({ cell, row }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={2}
            handleClick={event => {
              event.stopPropagation();
              navigate(`/staff/${row?.original?.staff?.id}`);
            }}
            color="#007AFF"
          />
        ),
      },
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
        size: 250,
        header: 'Tên khách hàng',
      },
      {
        accessorKey: 'email',
        header: 'Địa chỉ email',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
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
        accessorKey: 'segment.type',
        header: 'Phân khúc',
        size: 250,
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
        enableEditing: false,
        size: 250,
      },
      {
        accessorKey: 'address',
        header: 'Địa chỉ liên lạc',
        size: 250,
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'note',
        header: 'Ghi chú',
        Cell: ({ cell }) => (
          <EllipsisText
            text={`${cell.getValue<any>() || '-'}`}
            sx={{ fontSize: '14px' }}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        enableEditing: false,
        Cell: ({ cell }) => (
          <EllipsisText
            text={`${dayjs(cell.getValue<Date>()).format('DD/MM/YYYY')}`}
            sx={{ fontSize: '14px' }}
            line={2}
          />
        ),
      },
    ],
    [t, userInfo],
  );

  useEffect(() => {
    dispatch(actions.getSegment());
    dispatch(actions.getFileImport());
    dispatch(actionsProject.fetchListProject({ page: 1, limit: 1000 }));
    return () => {
      dispatch(actions.clearListLead());
    };
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case 0:
        dispatch(actions.fetchListLead(initialFilter));
        break;
      case 1:
        dispatch(actions.fetchListLeadAllotment(initialFilter));
        break;
      case 2:
        dispatch(actions.fetchListLeadAlloted(initialFilter));
        break;
      default:
        break;
    }
  }, [activeTab]);

  useEffect(() => {
    const options: Options[] = [{ label: 'Chọn tập tin', value: '' }];
    fileImport?.forEach(item => {
      options.push({
        label: item?.fileName,
        value: item?.id,
      });
    });
    setUnitOptions(options);
  }, [fileImport]);

  useEffect(() => {
    const options: Options[] = [{ label: 'Chọn dự án quan tâm', value: '' }];
    ProjectManagement?.data?.forEach(item => {
      options.push({
        label: item?.name,
        value: item?.id,
      });
    });
    setProjectOptions(options);
  }, [ProjectManagement?.data]);

  useEffect(() => {
    const options: Options[] = [{ label: 'Chọn phân khúc', value: '' }];
    Segment?.forEach(item => {
      options.push({
        label: item?.type ?? '',
        value: item?.id ?? '',
      });
    });
    setSegmentOptions(options);
  }, [Segment]);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    switch (activeTab) {
      case 0:
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
        break;
      case 1:
        setFilterSelectAllotment({
          ...filterSelectAllotment,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        });
        onFilterToQueryString({
          ...filter,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        });
        fetchDataForPage(filterSelectAllotment);
        break;
      case 2:
        setFilterSelectAlloted({
          ...filterSelectAlloted,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        });
        onFilterToQueryString({
          ...filter,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        });
        fetchDataForPage(filterSelectAlloted);
        break;
      default:
        break;
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    switch (activeTab) {
      case 0:
        dispatch(actions.fetchListLead(params));
        break;
      case 1:
        dispatch(actions.fetchListLeadAllotment(params));
        break;
      case 2:
        dispatch(actions.fetchListLeadAlloted(params));
        break;
      default:
        break;
    }
  };

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
  };

  const handleSearchInputAllotmentChange = (keyword: string) => {
    setTextSearchingAllotment(keyword);
  };

  const handleSearchInputAllotedChange = (keyword: string) => {
    setTextSearchingAlloted(keyword);
  };

  const submitFilter = () => {
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  const submitFilterAllotment = () => {
    onFilterToQueryString({
      ...filterSelectAllotment,
      page: 1,
      search: textSearchingAllotment,
    });
  };

  const submitFilterAlloted = () => {
    onFilterToQueryString({
      ...filterSelectAlloted,
      page: 1,
      search: textSearchingAlloted,
    });
  };

  const filterList = useMemo(() => {
    return [
      {
        label: 'Chọn tập tin',
        options: unitOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelect({
            ...filterSelect,
            fileImportId: value,
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
  }, [filterSelect, unitOptions]);

  const filterListAlloment = useMemo(() => {
    return [
      {
        label: 'Chọn phân khúc',
        options: segmentOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelectAllotment({
            ...filterSelectAllotment,
            segmentId: value,
          });
        },
      },
      {
        label: 'Chọn dự án quan tâm',
        options: projectOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelectAllotment({
            ...filterSelectAllotment,
            projectId: value,
          });
        },
      },
    ];
  }, [filterSelectAllotment, segmentOptions, projectOptions]);

  const filterListAlloted = useMemo(() => {
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
          setFilterSelectAlloted({
            ...filterSelectAlloted,
            status: value,
          });
        },
      },
      {
        label: 'Chọn phân khúc',
        options: segmentOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelectAlloted({
            ...filterSelectAlloted,
            segmentId: value,
          });
        },
      },
      {
        label: 'Chọn dự án quan tâm',
        options: projectOptions,
        handleSelected: (value: string | TableType) => {
          setFilterSelectAlloted({
            ...filterSelectAlloted,
            projectId: value,
          });
        },
      },
    ];
  }, [filterSelectAllotment, segmentOptions, projectOptions]);

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
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const documentRes = await document.uploadFileLeads(e.target.files[0]);
      if (documentRes) {
        fetchDataForPage(filter);
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload file excel thành công',
            type: 'success',
          }),
        );
      } else {
        dispatch(
          snackbarActions.updateSnackbar({
            message: 'Upload file excel không thành công',
            type: 'error',
          }),
        );
      }
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const hanldeDownloadTemplate = async () => {
    setIsLoading(true);
    let downloaddRes = await document.downloadLeadExcel();
    if (downloaddRes) {
      setIsLoading(false);
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Tải template không thành công',
          type: 'error',
        }),
      );
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  };

  const hanldeAllotment = () => {
    const idList = Object.keys(rowSelectionAllotment);

    if (idList.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa chọn lead',
          type: 'error',
        }),
      );
      return;
    }

    const payloadUpdate: PayloadLeadAllotment = {
      ids: idList,
    };
    setIsLoading(true);
    dispatch(
      actions.updateLeadAllotment(payloadUpdate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Phân bổ thành công',
                type: 'success',
              }),
            );
            dispatch(actions.fetchListLeadAllotment(initialFilter));
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Phân bổ không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
    setIsLoading(false);
  };

  const hanldeCloseConfirmDialog = () => {
    setIsOpenDialogConfirm(false);
  };

  const hanldeSubmitConfirmDialog = () => {
    const idList = Object.keys(rowSelection);

    const payloadUpdate: PayloadUpdateLeadSegment = {
      segmentId: segValue,
      ids: idList,
    };
    setIsLoading(true);
    dispatch(
      actions.updateLeadSegment(payloadUpdate, (res?: any) => {
        if (res) {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Phân khúc thành công',
                type: 'success',
              }),
            );
            dispatch(actions.fetchListLead(initialFilter));
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Phân khúc không thành công',
                type: 'error',
              }),
            );
          }
        }
      }),
    );
    setIsLoading(false);
    setIsOpenDialogConfirm(false);
  };

  const onChangeValue = (value: string) => {
    setSegValue(value);
    const idList = Object.keys(rowSelection);

    if (idList.length === 0) {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn chưa chọn lead',
          type: 'error',
        }),
      );
      return;
    }
    setIsOpenDialogConfirm(true);
  };

  const handleAddNew = (value: string) => {
    if (value.length > 0) {
      dispatch(
        actions.createSegment({ type: value }, async (res?: any) => {
          if (res) {
            await actions.getSegment();
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Thêm thành công',
                  type: 'success',
                }),
              );
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Thêm không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
    }
  };

  const renderFilter = () => {
    let view = null;
    switch (activeTab) {
      case 0:
        view = (
          <FilterBar
            onChangeSearchInput={handleSearchInputChange}
            placeholder={t(translations.common.search)}
            isFilter
            filterList={filterList}
            submitFilter={submitFilter}
          />
        );
        break;
      case 1:
        view = (
          <FilterBar
            onChangeSearchInput={handleSearchInputAllotmentChange}
            placeholder={t(translations.common.search)}
            isFilter
            filterList={filterListAlloment}
            submitFilter={submitFilterAllotment}
          />
        );
        break;
      case 2:
        view = (
          <FilterBar
            onChangeSearchInput={handleSearchInputAllotedChange}
            placeholder={t(translations.common.search)}
            isFilter
            filterList={filterListAlloted}
            submitFilter={submitFilterAlloted}
          />
        );
        break;
      default:
        break;
    }
    return view;
  };

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
              dispatch(actions.fetchListLead(initialFilter));
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Chỉnh sửa không thành công',
                  type: 'error',
                }),
              );
            }
          }
        }),
      );
      setIsLoading(false);
      exitEditingMode();
    };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid
        xs={12}
        sm={12}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display={'flex'} sx={{ alignItems: 'center' }}>
          <Typography fontSize={'20px'} fontWeight={700} lineHeight={'24px'}>
            {'Quản lý Leads'}
          </Typography>
        </Box>
        <Box sx={{ visibility: activeTab ? 'hidden' : 'unset' }}>
          <CustomButton
            title={'Upload file Excel'}
            isHide={!checkPermissionExist(PermissionKeyEnum.LEAD, userInfo)}
            isIcon
            buttonMode={'excel'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
            }}
            handleClick={handleUploadClick}
          />
          <input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <>
            <CustomButton
              title={'Tải'}
              isIcon
              isHide={!checkPermissionExist(PermissionKeyEnum.LEAD, userInfo)}
              propRef={anchorRef}
              buttonMode={'download'}
              sxProps={{
                background: palette.primary.button,
                borderRadius: 1,
                m: '0px 15px',
              }}
              handleClick={handleOpenDialog}
            />
            <MenuPopover
              open={isOpenDialog}
              onClose={handleCloseDialog}
              anchorEl={anchorRef.current}
              sx={{ width: 'max-content' }}
            >
              <List>
                <ListItemButton
                  sx={{
                    ':hover': {
                      backgroundColor: '#FDEAF4',
                    },
                    m: '6px',
                    borderRadius: '4px',
                  }}
                  onClick={handleOpenDialog}
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    onClick={hanldeDownloadTemplate}
                  >
                    <Typography
                      ml={1}
                      fontSize={'14px'}
                      fontWeight={400}
                      color={theme.palette.common.black}
                    >
                      Tải template
                    </Typography>
                  </Box>
                </ListItemButton>
              </List>
            </MenuPopover>
          </>
        </Box>
      </Grid>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          '& .MuiTab-root.Mui-selected': {
            color: palette.common.black,
          },
          mb: 2,
        }}
        TabIndicatorProps={{
          style: {
            backgroundColor: palette.primary.button,
          },
        }}
      >
        <Tab label="Chưa sàng lọc" />
        <Tab label="Đã sàng lọc" />
        <Tab label="Đã phân bổ" />
      </Tabs>
      {renderFilter()}
      <TabPanel value={activeTab} index={0}>
        <Box>
          {leadManager?.data ? (
            <MaterialReactTable
              initialState={{
                columnVisibility: {
                  'staff.code': false,
                  'segment.type': false,
                  status: false,
                },
              }}
              enableRowSelection
              getRowId={row => row.id}
              onRowSelectionChange={setRowSelection}
              columns={columns}
              data={leadManager?.data}
              manualPagination
              rowCount={leadManager?.total}
              onPaginationChange={setPagination}
              positionToolbarAlertBanner="bottom"
              enableEditing
              editingMode="row"
              positionActionsColumn="last"
              onEditingRowSave={handleSaveRow}
              enableColumnResizing
              enableStickyHeader
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  header: 'Hành động',
                  size: 110,
                },
              }}
              muiTableContainerProps={{ sx: { maxHeight: '545px' } }}
              muiTableBodyCellProps={{ sx: { padding: '8.3px 15px ' } }}
              muiTableHeadCellProps={{
                sx: {
                  background: 'rgb(254, 244, 250)',
                },
              }}
              renderTopToolbarCustomActions={({ table }) => {
                return (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <SellectSearch
                      data={Segment}
                      placeholder={'Phân khúc List'}
                      onChangeValue={onChangeValue}
                      handleAddNew={handleAddNew}
                    />
                  </div>
                );
              }}
              state={{
                pagination,
                isLoading,
                rowSelection,
              }}
            />
          ) : (
            <MaterialReactTable data={[]} columns={columns} />
          )}
        </Box>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Box>
          {leadManagerTrans?.data ? (
            <MaterialReactTable
              enableRowSelection
              getRowId={row => row.id}
              onRowSelectionChange={setRowSelectionAllotment}
              columns={columns}
              data={leadManagerTrans?.data}
              manualPagination
              rowCount={leadManagerTrans?.total}
              onPaginationChange={setPagination}
              enableEditing
              editingMode="row"
              initialState={{
                columnVisibility: { 'staff.code': false, status: false },
              }}
              positionActionsColumn="last"
              onEditingRowSave={handleSaveRow}
              positionToolbarAlertBanner="bottom"
              enableStickyHeader
              enableColumnResizing
              muiTableContainerProps={{ sx: { maxHeight: '545px' } }}
              muiTableBodyCellProps={{ sx: { padding: '8.3px 15px ' } }}
              muiTableHeadCellProps={{
                sx: {
                  background: 'rgb(254, 244, 250)',
                },
              }}
              state={{
                pagination,
                isLoading,
                rowSelection: rowSelectionAllotment,
              }}
              renderTopToolbarCustomActions={({ table }) => {
                return (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <CustomButton
                      title={'Phân bổ'}
                      isDisable={
                        !(Object.keys(rowSelectionAllotment)?.length > 0)
                      }
                      sxProps={{
                        borderRadius: 1,
                        height: '36px',
                      }}
                      handleClick={hanldeAllotment}
                    />
                  </div>
                );
              }}
            />
          ) : (
            <MaterialReactTable data={[]} columns={columns} />
          )}
        </Box>
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <Box>
          {leadManagerAlloted?.data ? (
            <MaterialReactTable
              columns={columns}
              data={leadManagerAlloted?.data}
              manualPagination
              rowCount={leadManagerAlloted?.total}
              onPaginationChange={setPagination}
              positionToolbarAlertBanner="bottom"
              enableEditing
              editingMode="row"
              positionActionsColumn="last"
              onEditingRowSave={handleSaveRow}
              enableStickyHeader
              enableColumnResizing
              muiTableContainerProps={{ sx: { maxHeight: '545px' } }}
              muiTableBodyCellProps={{ sx: { padding: '8.3px 15px ' } }}
              muiTableHeadCellProps={{
                sx: {
                  background: 'rgb(254, 244, 250)',
                },
              }}
              state={{
                pagination,
                isLoading,
                rowSelection: rowSelectionAllotment,
              }}
            />
          ) : (
            <MaterialReactTable data={[]} columns={columns} />
          )}
        </Box>
      </TabPanel>
      {isOpenDialogConfirm && (
        <ConfirmDialog
          isOpen={isOpenDialogConfirm}
          handleClose={hanldeCloseConfirmDialog}
          handleSubmit={hanldeSubmitConfirmDialog}
          isIcon={false}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              fontSize={'24px'}
              fontWeight={700}
              width={400}
              color={palette.primary.text}
              mx="auto"
              mb={2}
              mt={2}
              textAlign={'center'}
            >
              {'Phân khúc List'}
            </Typography>
            <Typography
              fontSize={'16px'}
              fontWeight={400}
              color={palette.primary.text}
              mb={5}
              textAlign={'center'}
            >
              Bạn có chắc chắn muốn Phân khúc List thành
              <span style={{ fontWeight: 'bold', margin: '0px 4px' }}>
                {Segment?.find(e => e.id === segValue)?.type}
              </span>
              không?
            </Typography>
          </div>
        </ConfirmDialog>
      )}
    </Paper>
  );
}
