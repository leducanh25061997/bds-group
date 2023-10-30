import {
  Box,
  IconButton,
  List,
  ListItemButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { EllipsisText } from 'app/components/EllipsisText';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useFilter, useProfile } from 'app/hooks';
import EDIT_ICON from 'assets/background/edit-icon.svg';
import EDIT_HISTORY from 'assets/background/history.svg';
import { translations } from 'locales/translations';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilterParams } from 'types';
import {
  ApproveCustomerBigTypeEnum,
  CustomerGroupType,
  TableType,
  TransferTextCustomerSourceType,
} from 'types/Enum';
import { CustomerItem, Options } from 'types/User';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CLOSEICON from '@mui/icons-material/Close';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CustomButton from 'app/components/Button';
import MenuPopover from 'app/components/MenuPopover';
import { useOrgchartSlice } from 'app/pages/Orgchart/slice';
import { selectOrgchart } from 'app/pages/Orgchart/slice/selector';
import path from 'app/routes/path';
import CHECK_ICON from 'assets/background/checkgreen_icon.svg';
import SENT_ICON from 'assets/background/send-icon-green.svg';
import dayjs, { Dayjs } from 'dayjs';
import { get } from 'lodash';
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_PaginationState,
} from 'material-react-table';
import { useForm } from 'react-hook-form';
import document from 'services/api/document';
import palette from 'styles/theme/palette';
import { PermissionKeyEnum } from 'types/Permission';
import {
  checkPermissionExist,
  formatDateTime2,
  renderCustomerGroup,
  renderStatusCustomerBig,
} from 'utils/helpers';

import FilterBar from 'app/components/Filterbar';
import { useSettingSlice } from 'app/pages/Settings/slice';
import { selectSetting } from 'app/pages/Settings/slice/selector';
import { useCustomerSlice } from '../../slice';
import { selectCustomer } from '../../slice/selector';
import ActivityDetailDialog from '../ActivityDetailDialog';
import CreateActivityDialog from '../ActivityDialog';
import CheckFailCustomerDialog from '../CheckFailCustomerDialog';
import { PayloadSentApprove } from '../../slice/types';

interface StateLocationProps {
  customerId?: string;
}

export default function ListCustomerPro() {
  const { actions } = useCustomerSlice();
  const navigate = useNavigate();
  const userInfo = useProfile();
  const theme = useTheme();
  const anchorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { customerManager } = useSelector(selectCustomer);
  const { actions: actionsOrgchart } = useOrgchartSlice();
  const { actions: actionsSetting } = useSettingSlice();
  const { OrgchartManagement } = useSelector(selectOrgchart);
  const { userManager } = useSelector(selectSetting);
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 10,
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [textSearching, setTextSearching] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>('');
  const [isOpenDialogHistory, setIsOpenDialogHistory] =
    useState<boolean>(false);
  const [showPopupCheckFail, setShowPopupCheckFail] = useState<any>({
    isOpen: false,
    itemSelect: null,
  });

  const locationProps = state as StateLocationProps;
  const [isOpenDialogDetail, setIsOpenDialogDetail] = useState<boolean>(false);
  const [unitOptions, setUnitOptions] = useState<Options[]>([
    { label: 'Chọn đơn vị', value: '' },
  ]);

  const [saleOptions, setSaleOptions] = useState<Options[]>([
    { label: 'Chọn tư vấn viên', value: '' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã KH',
        Cell: ({ cell, row }) => (
          <EllipsisText
            text={`${cell.getValue<any>()}`}
            line={1}
            color="#007AFF"
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            handleClick={event => {
              event.stopPropagation();
              handleOpenDialogActivityDetail(row.original);
            }}
          />
        ),
      },
      {
        accessorKey: 'source',
        header: 'Nguồn',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${
              cell.getValue<any>()
                ? get(TransferTextCustomerSourceType, cell.getValue<any>())
                : '-'
            }`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'staff.code',
        header: 'Mã TVV',
        Cell: ({ cell, row }) => (
          <EllipsisText
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
            handleClick={event => {
              event.stopPropagation();
              navigate(`/staff/${row?.original?.staff?.id}`);
            }}
            color="#007AFF"
          />
        ),
      },
      {
        accessorKey: 'staff.fullName',
        header: 'Tên TVV',
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
        accessorKey: 'customerBigApprove',
        header: 'Trạng thái',
        size: 250,
        Cell: ({ cell, row }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${renderStatusCustomerBig(row?.original) ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'groupType',
        header: 'Loại khách hàng',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${renderCustomerGroup(cell.getValue<any>()) ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Tên khách hàng',
        size: 250,
      },
      {
        accessorKey: 'birth',
        header: 'Ngày sinh',
        Cell: ({ cell, row }) =>
          row?.original?.birth && row?.original?.birth?.includes('/') ? (
            <EllipsisText
              text={`${formatDateTime2(row?.original?.birth)}`}
              line={1}
            />
          ) : (
            <EllipsisText text={`${row?.original?.birth ?? '---'}`} line={1} />
          ),
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
        accessorKey: 'identityNumber',
        header: 'CMND/ CCCD',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
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
            text={`${cell.getValue<any>() || '-'}`}
            sx={{ fontSize: '14px' }}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'action',
        header: 'Hành động',
        enableColumnActions: false,
        enableResizing: false,
        Cell: ({ row }) => {
          const [anchorElCheckPass, setAnchorElCheckPass] =
            useState<HTMLButtonElement | null>(null);

          const handleClose = () => {
            setAnchorElCheckPass(null);
          };

          return (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '8px',
              }}
            >
              {checkPermissionExist(
                PermissionKeyEnum.CUSTOMER_APPRAISAL,
                userInfo,
              ) && (
                <Box>
                  <Tooltip
                    title={
                      !row?.original?.isAppraisal
                        ? row?.original?.reason
                        : 'Đánh giá'
                    }
                  >
                    <IconButton
                      aria-describedby={
                        Boolean(anchorElCheckPass)
                          ? `simple-popover`
                          : undefined
                      }
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                        setAnchorElCheckPass(event.currentTarget);
                      }}
                    >
                      {row.original?.groupType ===
                      CustomerGroupType.BIG ? null : row.original
                          ?.isAppraisal ? (
                        <CheckBoxIcon
                          fontSize="small"
                          sx={{ color: '#2FB350' }}
                        />
                      ) : (
                        <DisabledByDefaultIcon
                          fontSize="small"
                          sx={{ color: '#FF595C' }}
                        />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Popover
                    id={
                      Boolean(anchorElCheckPass) ? `simple-popover` : undefined
                    }
                    open={Boolean(anchorElCheckPass)}
                    anchorEl={anchorElCheckPass}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        width: 'fit-content',
                        height: 'fit-content',
                        borderRadius: '4px',
                        p: 0.5,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        cursor: 'pointer',
                        ':hover': {
                          background: '#FDEAF4',
                        },
                        p: '6px',
                      }}
                      onClick={() => {
                        handleAppraisal(row.original, true);
                        handleClose();
                      }}
                    >
                      <Box
                        sx={{
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          mr: 1,
                        }}
                      >
                        <img src={CHECK_ICON} alt="" />
                      </Box>
                      Đạt
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        p: '6px',
                        cursor: 'pointer',
                        ':hover': {
                          background: '#FDEAF4',
                        },
                      }}
                      onClick={() => {
                        handleAppraisal(row.original, false);
                        handleClose();
                      }}
                    >
                      <CLOSEICON
                        fontSize="small"
                        sx={{ color: '#E42B2C', mr: 1 }}
                      />
                      Không đạt
                    </Box>
                  </Popover>
                </Box>
              )}
              {userInfo?.staffId === row.original?.staff?.id && (
                <Tooltip title="Thêm lịch sử">
                  <IconButton
                    onClick={() => handleOpenDialogActivity(row.original)}
                  >
                    <img src={EDIT_HISTORY} alt="icon history" />
                  </IconButton>
                </Tooltip>
              )}
              {userInfo?.staffId === row.original?.staff?.id && (
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    onClick={() => handleEdit(row.original)}
                    sx={{ ml: 1 }}
                  >
                    <img src={EDIT_ICON} alt="icon edit" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        },
      },
    ],
    [t, userInfo],
  );

  const columnNotAppraisal = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã KH',
        Cell: ({ cell, row }) => (
          <EllipsisText
            text={`${cell.getValue<any>()}`}
            line={1}
            color={
              userInfo?.staffId === row.original?.staff?.id
                ? '#007AFF'
                : 'black'
            }
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            handleClick={event => {
              event.stopPropagation();
              handleOpenDialogActivityDetail(row.original);
            }}
          />
        ),
      },
      {
        accessorKey: 'source',
        header: 'Nguồn',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${
              cell.getValue<any>()
                ? get(TransferTextCustomerSourceType, cell.getValue<any>())
                : '-'
            }`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'staff.code',
        header: 'Mã TVV',
        Cell: ({ cell, row }) => (
          <EllipsisText
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
            handleClick={event => {
              event.stopPropagation();
              navigate(`/staff/${row?.original?.staff?.id}`);
            }}
            color="#007AFF"
          />
        ),
      },
      {
        accessorKey: 'staff.fullName',
        header: 'Tên TVV',
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
        accessorKey: 'customerBigApprove',
        header: 'Trạng thái',
        size: 250,
        Cell: ({ cell, row }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${renderStatusCustomerBig(row?.original) ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'groupType',
        header: 'Loại khách hàng',
        size: 250,
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${renderCustomerGroup(cell.getValue<any>()) ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Tên khách hàng',
        size: 250,
      },
      {
        accessorKey: 'birth',
        header: 'Ngày sinh',
        Cell: ({ cell, row }) =>
          row?.original?.birth && row?.original?.birth?.includes('/') ? (
            <EllipsisText
              text={`${formatDateTime2(row?.original?.birth)}`}
              line={1}
            />
          ) : (
            <EllipsisText text={`${row?.original?.birth ?? '---'}`} line={1} />
          ),
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
        accessorKey: 'identityNumber',
        header: 'CMND/ CCCD',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
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
            text={`${cell.getValue<any>() || '-'}`}
            sx={{ fontSize: '14px' }}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'Appraisal',
        header: 'Đánh giá',
        Cell: ({ cell, row }) => renderAppraisal(row.original),
      },
      {
        accessorKey: 'action',
        header: 'Hành động',
        enableColumnActions: false,
        enableResizing: false,
        Cell: ({ row }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '8px',
              }}
            >
              {userInfo?.staffId === row.original?.staff?.id &&
                row.original?.groupType === CustomerGroupType.BIG &&
                row.original?.customerBigApprove &&
                row.original?.customerBigApprove[0]?.status ===
                  ApproveCustomerBigTypeEnum.CREATE && (
                  <Tooltip title="Gửi duyệt">
                    <IconButton onClick={() => handleSentConfirm(row.original)}>
                      <img src={SENT_ICON} alt="icon sent" />
                    </IconButton>
                  </Tooltip>
                )}
              {userInfo?.staffId === row.original?.staff?.id && (
                <Tooltip title="Thêm lịch sử">
                  <IconButton
                    onClick={() => handleOpenDialogActivity(row.original)}
                  >
                    <img src={EDIT_HISTORY} alt="icon history" />
                  </IconButton>
                </Tooltip>
              )}
              {userInfo?.staffId === row.original?.staff?.id &&
                ((row.original?.groupType === CustomerGroupType.BIG &&
                  (row.original?.customerBigApprove.length === 0 ||
                    (row.original?.customerBigApprove &&
                      row.original?.customerBigApprove[0]?.status ===
                        ApproveCustomerBigTypeEnum.CREATE))) ||
                  row.original?.groupType !== CustomerGroupType.BIG) && (
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      onClick={() => handleEdit(row.original)}
                      sx={{ ml: 1 }}
                    >
                      <img src={EDIT_ICON} alt="icon edit" />
                    </IconButton>
                  </Tooltip>
                )}
            </Box>
          );
        },
      },
    ],
    [t, userInfo],
  );

  const renderAppraisal = (data: CustomerItem) => {
    if (data?.groupType === CustomerGroupType.BIG) {
      if (
        data?.customerBigApprove[0]?.status !==
        ApproveCustomerBigTypeEnum.APPROVED
      ) {
        // return renderAppraisalIcon(false, 'Chờ duyệt');
      } else {
        return renderAppraisalIcon(true, 'Dữ liệu đạt');
      }
    } else if (data?.isAppraisal) {
      return renderAppraisalIcon(true, 'Dữ liệu đạt');
    } else {
      return renderAppraisalIcon(false, data?.reason || 'Dữ liệu chưa đạt');
    }
  };

  const renderAppraisalIcon = (status: boolean, title: string) => {
    if (status) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            mr: 1,
          }}
        >
          <Tooltip title={title}>
            <img src={CHECK_ICON} alt="" />
          </Tooltip>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <Tooltip title={title}>
            <CLOSEICON fontSize="small" sx={{ color: '#E42B2C' }} />
          </Tooltip>
        </Box>
      );
    }
  };

  useEffect(() => {
    const orgchart: Options[] = [{ label: 'Chọn đơn vị', value: '' }];
    OrgchartManagement?.data.forEach(item => {
      orgchart.push({
        label: item?.name,
        value: item?.name,
      });
    });
    setUnitOptions(orgchart);
  }, [OrgchartManagement?.data]);

  useEffect(() => {
    const newData: Options[] = [{ label: 'Chọn tư vấn viên', value: '' }];
    userManager?.data?.forEach(item => {
      newData.push({
        label: item.staff?.fullName,
        value: item.staff?.fullName,
      });
    });
    setSaleOptions(newData);
  }, [userManager?.data]);

  useEffect(() => {
    return () => {
      dispatch(actions.clearListCustomer());
    };
  }, []);

  const redirectToCreatePage = () => navigate(path.createCustomer);

  const downloadListCusstomer = async () => {
    setIsLoading(true);
    let downloaddRes = await document.downloadCustomerExcel(
      filterSelect,
      false,
    );
    if (downloaddRes) {
      setIsLoading(false);
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Tải danh sách KH không thành công',
          type: 'error',
        }),
      );
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  };

  const downloadTemplateCustomer = async () => {
    setIsLoading(true);
    let downloaddRes = await document.downloadTemplateCustomer();
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
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const documentRes = await document.uploadFileCustomer(
        e.target.files[0],
        false,
        'TemplateCustomer',
        2,
        0,
      );
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

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (locationProps?.customerId) {
      setCustomerId(locationProps?.customerId);
      setTimeout(() => {
        setIsOpenDialogDetail(true);
      }, 300);
    }
  }, [locationProps]);

  useEffect(() => {
    setFilterSelect({
      ...filterSelect,
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    });
    onFilterToQueryString({
      ...filter,
      page: pagination.pageIndex,
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
    dispatch(actions.fetchListCustomer(params));
    dispatch(actionsOrgchart.fetchListOrgchart());
    dispatch(actionsSetting.fetchListUser(params));
  };

  const handleEdit = (items: CustomerItem) => {
    if (userInfo?.staffId === items.staff?.id) {
      navigate(`/customer/customers-potential/${items.id}`);
    }
  };

  const handleSentConfirm = (items: CustomerItem) => {
    if (userInfo?.staffId === items.staff?.id && items?.customerBigApprove) {
      const approveId = items?.customerBigApprove[0]?.id;
      const payload: PayloadSentApprove = {
        approveId: approveId,
        customerId: items.id,
      };
      dispatch(
        actions.sendApproveCustomer(payload, (res?: any) => {
          if (res?.success) {
            dispatch(
              snackbarActions.updateSnackbar({
                message: 'Gửi duyệt thành công',
                type: 'success',
              }),
            );
            fetchDataForPage(filterSelect);
          } else {
            dispatch(
              snackbarActions.updateSnackbar({
                message:
                  res?.response?.data?.message || 'Gửi duyệt không thành công',
                type: 'error',
              }),
            );
          }
        }),
      );
    }
  };

  const handleAppraisal = (items: CustomerItem, isAppraisal: boolean) => {
    if (checkPermissionExist(PermissionKeyEnum.CUSTOMER_APPRAISAL, userInfo)) {
      const payload = { id: items.id, isAppraisal };
      if (isAppraisal) {
        dispatch(
          actions.appraisalCustomer(payload, (res?: any) => {
            if (res?.success) {
              dispatch(
                snackbarActions.updateSnackbar({
                  message: 'Đánh giá thành công',
                  type: 'success',
                }),
              );
              fetchDataForPage(filterSelect);
            } else {
              dispatch(
                snackbarActions.updateSnackbar({
                  message:
                    res?.response?.data?.message || 'Đánh giá không thành công',
                  type: 'error',
                }),
              );
            }
          }),
        );
      } else {
        setShowPopupCheckFail({
          isOpen: true,
          itemSelect: items,
        });
      }
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn không có quyền đánh giá thông tin KH',
          type: 'error',
        }),
      );
    }
  };

  const handleConfirmFailIsAppraisal = (reason?: string) => {
    const payload = {
      id: showPopupCheckFail?.itemSelect?.id,
      isAppraisal: false,
      reason,
    };
    dispatch(
      actions.appraisalCustomer(payload, (res?: any) => {
        if (res?.success) {
          dispatch(
            snackbarActions.updateSnackbar({
              message: 'Đánh giá thành công',
              type: 'success',
            }),
          );
          fetchDataForPage(filterSelect);
          handleCloseConfirmFailIsAppraisal();
        } else {
          dispatch(
            snackbarActions.updateSnackbar({
              message:
                res?.response?.data?.message || 'Đánh giá không thành công',
              type: 'error',
            }),
          );
        }
      }),
    );
  };

  const handleCloseConfirmFailIsAppraisal = () => {
    setShowPopupCheckFail({
      isOpen: false,
      itemSelect: null,
    });
  };

  const handleOpenDialog = (item: any) => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setIsOpenDialogHistory(false);
    setIsOpenDialogDetail(false);
  };

  const handleOpenDialogActivity = (item: any) => {
    setCustomerId(item.id);
    setIsOpenDialogHistory(true);
  };

  const handleOpenDialogActivityDetail = (item: any) => {
    setCustomerId(item.id);
    setIsOpenDialogDetail(true);
  };

  const handleAddHistory = () => {
    setIsOpenDialogDetail(false);
    setTimeout(() => {
      setIsOpenDialogHistory(true);
    }, 500);
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
    const isHide = !checkPermissionExist(
      PermissionKeyEnum.CUSTOMER_VIEW_IN_ORGCHART,
      userInfo,
    );
    return [
      {
        label: 'Loại khách hàng',
        options: [
          {
            label: 'Chọn loại khách hàng',
            value: '',
          },
          {
            label: 'KH tiềm năng',
            value: CustomerGroupType.POTENTIAL,
          },
          {
            label: 'KH quan tâm',
            value: CustomerGroupType.INTERESTED,
          },
          {
            label: 'KH phát sinh hằng ngày',
            value: CustomerGroupType.DAILY,
          },
          {
            label: 'KH lớn',
            value: CustomerGroupType.BIG,
          },
        ],
        handleSelected: (value: any) => {
          setFilterSelect({
            ...filterSelect,
            groupType: value,
          });
        },
      },
      {
        label: 'Tư vấn viên',
        options: saleOptions,
        isHide: isHide,
        handleSelected: (value: string | TableType) => {
          setFilterSelect({
            ...filterSelect,
            staffName: value,
          });
        },
      },
      {
        label: 'Đơn vị/ Công ty',
        options: unitOptions,
        isHide: isHide,
        handleSelected: (value: string | TableType) => {
          setFilterSelect({
            ...filterSelect,
            nameOrgchart: value,
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
  }, [filterSelect, unitOptions, saleOptions]);

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
          {t(translations.sidebar.customerPotential)}
        </Typography>
        <Box style={{ display: 'flex' }}>
          <CustomButton
            title={'Upload file Excel'}
            isHide={
              !checkPermissionExist(PermissionKeyEnum.CUSTOMER_CREATE, userInfo)
            }
            isIcon
            buttonMode={'excel'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
              mb: '20px',
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
              propRef={anchorRef}
              buttonMode={'download'}
              sxProps={{
                background: palette.primary.button,
                borderRadius: 1,
                m: '0px 15px 20px 15px',
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
                  <Link
                    style={{ color: 'transparent' }}
                    to={'/static/template/template_Customer.xlsx'}
                    download="Template_KhachHang"
                    target="_blank"
                  >
                    <Box display={'flex'} alignItems={'center'}>
                      <Typography
                        ml={1}
                        fontSize={'14px'}
                        fontWeight={400}
                        color={theme.palette.common.black}
                      >
                        Tải template
                      </Typography>
                    </Box>
                  </Link>
                </ListItemButton>
                <ListItemButton
                  sx={{
                    ':hover': {
                      backgroundColor: '#FDEAF4',
                    },
                    m: '6px',
                    borderRadius: '4px',
                  }}
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    onClick={downloadListCusstomer}
                  >
                    <Typography
                      ml={1}
                      fontSize={'14px'}
                      fontWeight={400}
                      color={theme.palette.common.black}
                    >
                      Tải danh sách khách hàng
                    </Typography>
                  </Box>
                </ListItemButton>
              </List>
            </MenuPopover>
          </>
          <CustomButton
            title={'Thêm KH'}
            isIcon
            isHide={
              !checkPermissionExist(PermissionKeyEnum.CUSTOMER_CREATE, userInfo)
            }
            buttonMode={'create'}
            sxProps={{
              background: palette.primary.button,
              borderRadius: 1,
              mb: '20px',
            }}
            handleClick={redirectToCreatePage}
          />
        </Box>
      </Box>
      <FilterBar
        onChangeSearchInput={handleSearchInputChange}
        placeholder={t(translations.common.search)}
        isFilter
        filterList={filterList}
        submitFilter={submitFilter}
      />
      <Box>
        {customerManager?.data ? (
          <MaterialReactTable
            columns={
              checkPermissionExist(
                PermissionKeyEnum.CUSTOMER_APPRAISAL,
                userInfo,
              )
                ? columns
                : columnNotAppraisal
            }
            data={customerManager?.data}
            manualPagination
            rowCount={customerManager?.total}
            onPaginationChange={setPagination}
            enableStickyHeader
            enableColumnResizing
            muiTableContainerProps={{ sx: { maxHeight: '540px' } }}
            muiTableBodyCellProps={{ sx: { padding: '8.3px 15px ' } }}
            muiTableHeadCellProps={{
              sx: {
                background: 'rgb(254, 244, 250)',
              },
            }}
            state={{
              pagination,
              isLoading,
            }}
            // initialState={{columnPinning: { left: ['code'] }}}
            // enableRowActions
            //         positionActionsColumn="last"
            //         renderRowActions={({ row, table }) => (
            //           <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            //             {userInfo?.staffId === row.original?.staff?.id && (
            //             <Tooltip title="Thêm lịch sử">
            //               <IconButton onClick={() => handleOpenDialogActivity(row.original)}>
            //                 <img src={EDIT_HISTORY} alt="icon history" />
            //               </IconButton>
            //             </Tooltip>
            //           )}
            //           {userInfo?.staffId === row.original?.staff?.id && (
            //             <Tooltip title="Chỉnh sửa">
            //               <IconButton onClick={() => handleEdit(row.original)} sx={{ ml: 1 }}>
            //                 <img src={EDIT_ICON} alt="icon edit" />
            //               </IconButton>
            //             </Tooltip>
            //           )}
            //             </Box>
            // )}
          />
        ) : (
          <p>No data available.</p>
        )}
      </Box>

      {isOpenDialogHistory && (
        <CreateActivityDialog
          isOpen={isOpenDialogHistory}
          handleClose={handleCloseDialog}
          customerId={customerId}
          actionName={'Lưu'}
        />
      )}

      {isOpenDialogDetail && (
        <ActivityDetailDialog
          isOpen={isOpenDialogDetail}
          handleClose={handleCloseDialog}
          handeAddHistory={handleAddHistory}
          id={customerId}
        />
      )}
      <CheckFailCustomerDialog
        isOpen={showPopupCheckFail.isOpen}
        handleClose={handleCloseConfirmFailIsAppraisal}
        handleConfirm={handleConfirmFailIsAppraisal}
        itemSelect={showPopupCheckFail.itemSelect}
      />
    </Paper>
  );
}
