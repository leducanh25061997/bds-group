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
import CustomButton from 'app/components/Button';
import { EllipsisText } from 'app/components/EllipsisText';
import MenuPopover from 'app/components/MenuPopover';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import { useFilter, useProfile } from 'app/hooks';
import { useCustomerSlice } from 'app/pages/CustomerPotential/slice';
import { selectCustomer } from 'app/pages/CustomerPotential/slice/selector';
import dayjs, { Dayjs } from 'dayjs';
import { translations } from 'locales/translations';
import { get } from 'lodash';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import document from 'services/api/document';
import palette from 'styles/theme/palette';
import { FilterParams } from 'types';
import { TransferTextCustomerSourceType } from 'types/Enum';
import { PermissionKeyEnum } from 'types/Permission';
import { CustomerItem } from 'types/User';
import { checkPermissionExist, renderCustomerGroup, renderCustomerTransaction } from 'utils/helpers';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CLOSEICON from '@mui/icons-material/Close';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import FilterBar from 'app/components/Filterbar';
import CHECK_ICON from 'assets/background/checkgreen_icon.svg';
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_PaginationState,
} from 'material-react-table';
import CustomerDetailDialog from '../CustomerDetailDialog';

export default function ListCustomerPro() {
  const { actions } = useCustomerSlice();
  const userInfo = useProfile();
  const theme = useTheme();

  const anchorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRefCompany = useRef<HTMLInputElement | null>(null);
  const { actions: snackbarActions } = useSnackbarSlice();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { customerManagerTrans } = useSelector(selectCustomer);
  const [textSearching, setTextSearching] = useState<string>('');
  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 10,
      isCreen: true
    };
  }, []);
  const [filterSelect, setFilterSelect] = useState<FilterParams>(initialFilter);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenDialogExcel, setIsOpenDialogExcel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string>('');
  const [isOpenDialogDetail, setIsOpenDialogDetail] = useState<boolean>(false);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

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

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã KH',
        Cell: ({ cell, row }) => (
          <EllipsisText
            text={`${cell.getValue<any>()}`}
            line={1}
            color={'#007AFF'}
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            handleClick={event => {
              event.stopPropagation();
              handleOpenDialogDetail(row.original);
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
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
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
        Cell: ({ cell }) => (
          <EllipsisText
            text={`${dayjs(cell.getValue<Date>()).format('DD/MM/YYYY') ?? '-'}`}
            line={1}
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
        accessorKey: 'createDate',
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
        Cell: ({ cell, row }) =>
          row.original?.isAppraisal ? (
            <Box
              sx={{
                width: '100%',
                height: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <img src={CHECK_ICON} alt="" />
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <CLOSEICON fontSize="small" sx={{ color: '#E42B2C' }} />
            </Box>
          ),
      },
    ],
    [t],
  );

  const columnsAppraisal = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã KH',
        Cell: ({ cell, row }) => (
          <EllipsisText
            text={`${cell.getValue<any>()}`}
            line={1}
            color={'#007AFF'}
            sx={{ fontSize: '14px', cursor: 'pointer' }}
            handleClick={event => {
              event.stopPropagation();
              // handleOpenDialogActivityDetail(row.original);
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
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
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
        accessorKey: 'type',
        header: 'Khách hàng giao dịch',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${renderCustomerTransaction(cell.getValue<any>()) ?? '-'}`}
            line={2}
          />
        ),
      },
      {
        accessorKey: 'companyName',
        header: 'Tên công ty',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
          />
        ),
      },
      {
        accessorKey: 'companyCode',
        header: 'Mã số doanh nghiệp',
        Cell: ({ cell }) => (
          <EllipsisText
            sx={{ fontSize: '14px' }}
            text={`${cell.getValue<any>() ?? '-'}`}
            line={1}
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
        Cell: ({ cell }) => (
          <EllipsisText
            text={`${dayjs(cell.getValue<Date>()).format('DD/MM/YYYY') ?? '-'}`}
            line={1}
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
        accessorKey: 'addressBorn',
        header: 'Địa chỉ thường trú',
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
                position: 'relative',
              }}
            >
              {checkPermissionExist(
                PermissionKeyEnum.CUSTOMER_APPRAISAL,
                userInfo,
              ) && (
                <Box>
                  <Tooltip title="Đánh giá">
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
                      {row.original?.isAppraisal ? (
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
            </Box>
          );
        },
      },
    ],
    [t],
  );

  useEffect(() => {
    return () => {
      dispatch(actions.clearListCustomerTrans());
    };
  }, []);

  const { filter, onFilterToQueryString } = useFilter({
    onFetchData: (params: FilterParams) => {
      fetchDataForPage(params);
    },
    defaultFilter: initialFilter,
  });

  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListCustomerTransacion(params));
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleOpenDialogDetail = (item: any) => {
    setCustomerId(item.id);
    setIsOpenDialogDetail(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setIsOpenDialogDetail(false);
  };

  const handleAppraisal = (items: CustomerItem, isAppraisal: boolean) => {
    if (checkPermissionExist(PermissionKeyEnum.CUSTOMER_APPRAISAL, userInfo)) {
      const payload = { id: items.id, isAppraisal };
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
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Bạn không có quyền đánh giá thông tin KH',
          type: 'error',
        }),
      );
    }
  };

  const handleOpenDialogExcel = () => {
    setIsOpenDialogExcel(true);
  };

  const handleCloseDialogExcel = () => {
    setIsOpenDialogExcel(false);
  };

  const renderItem = (item: CustomerItem, index: number) => {
    const addressLink = `${item?.street ? `${item.street},` : ''} ${
      item?.ward ? `${item.ward},` : ''
    } ${item?.district ? `${item.district},` : ''} ${
      item?.province ? `${item.province}` : ''
    }`.trim();
    return [
      <EllipsisText
        text={`${item.code}`}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          event.stopPropagation();
        }}
      />,
      <EllipsisText
        text={`${
          item?.source ? get(TransferTextCustomerSourceType, item?.source) : '-'
        }`}
        line={2}
      />,
      <EllipsisText text={`${item.staff?.code ?? '-'}`} line={1} />,
      <EllipsisText text={`${item.staff?.fullName ?? '-'}`} line={2} />,
      <EllipsisText text={`${renderCustomerGroup(item.groupType)}`} line={2} />,
      <EllipsisText text={`${renderCustomerTransaction(item.type)}`} line={2} />,
      <EllipsisText text={`${item.companyName ?? '-'}`} line={2} />,
      <EllipsisText text={`${item.companyCode ?? '-'}`} line={2} />,
      <EllipsisText text={`${item.name ?? '-'}`} line={2} />,
      <EllipsisText
        text={`${dayjs(item.birth).format('DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText text={`${item.email ?? '-'}`} line={1} />,
      <EllipsisText text={`${item.phoneNumber ?? '-'}`} line={1} />,
      <EllipsisText text={`${addressLink ?? '-'}`} line={2} />,
      <EllipsisText text={`${item.addressBorn ?? '-'}`} line={2} />,
      <EllipsisText text={`${item.identityNumber ?? '-'}`} line={1} />,
      <EllipsisText
        text={`${dayjs(item.createdAt).format('DD/MM/YYYY')}`}
        line={1}
      />,
      <EllipsisText text={`${item.note || '-'}`} line={2} />,
    ];
  };

  const handleSearchInputChange = (keyword: string) => {
    setTextSearching(keyword);
  };

  const submitFilter = () => {
    setFilterSelect({ ...filterSelect, search: textSearching });
    onFilterToQueryString({
      ...filterSelect,
      page: 1,
      search: textSearching,
    });
  };

  const filterList = useMemo(() => {
    return [
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

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleUploadClickCompany = () => {
    inputRefCompany.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const documentRes = await document.uploadFileCustomer(
        e.target.files[0],
        true,
        'Template-KhachHangCaNhan',
        3,
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
      e.target.value = ''
    }
  };

  const handleFileChangeImportCompany = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const documentRes = await document.uploadFileCustomer(
        e.target.files[0],
        true,
        'Template-KhachHangDoanhNghiep',
        3,
        1,
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
      e.target.value = ''
    }
  };

  const downloadListCustomer = () => {
    document.downloadCustomerExcel(filterSelect, true);
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
          {t(translations.sidebar.customerPotential)}
        </Typography>
        <Box style={{ display: 'flex' }}>
          <>
            <CustomButton
              title={'Upload file Excel'}
              isIcon
              propRef={anchorRef}
              buttonMode={'excel'}
              sxProps={{
                background: palette.primary.button,
                borderRadius: 1,
                m: '0px 15px 20px 15px',
              }}
              handleClick={handleOpenDialogExcel}
            />
            <MenuPopover
              open={isOpenDialogExcel}
              onClose={handleCloseDialogExcel}
              anchorEl={anchorRef.current}
              sx={{ width: 'max-content', left: '900px !important' }}
            >
              <List>
                <ListItemButton
                  sx={{
                    ':hover': {
                      backgroundColor: '#FDEAF4',
                    },
                    m: '6px',
                    height: '40px',
                    borderRadius: '4px',
                  }}
                >
                  <CustomButton
                    title={'Khách hàng giao dịch doanh nghiệp'}
                    isHide={
                      !checkPermissionExist(PermissionKeyEnum.CUSTOMER_CREATE, userInfo)
                    }
                    sxProps={{
                      background: 'unset',
                      ':hover': {
                        backgroundColor: '#FDEAF4',
                      },
                    }}
                    sxPropsText={{ color: '#000',fontSize: '14px', fontWeight: '400'}}
                    isIcon={false}
                    handleClick={handleUploadClickCompany}
                  />
                  <input
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ref={inputRefCompany}
                    onChange={handleFileChangeImportCompany}
                    style={{ display: 'none' }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    ':hover': {
                      backgroundColor: '#FDEAF4',
                    },
                    m: '6px',
                    height: '40px',
                    borderRadius: '4px',
                  }}
                >
                  <CustomButton
                    title={'Khách hàng giao dịch cá nhân'}
                    isHide={
                      !checkPermissionExist(PermissionKeyEnum.CUSTOMER_CREATE, userInfo)
                    }
                    sxProps={{
                      background: 'unset',
                      ':hover': {
                        backgroundColor: '#FDEAF4',
                      },
                    }}
                    sxPropsText={{ color: '#000',fontSize: '14px', fontWeight: '400'}}
                    isIcon={false}
                    handleClick={handleUploadClick}
                  />
                  <input
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </ListItemButton>
              </List>
            </MenuPopover>
          </>
          <>
            <CustomButton
              title={'Tải DS khách hàng'}
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
                    to={'/static/template/template_KHGD_DoanhNghiep.xlsx'}
                    download="Template_KhachHangGiaoDich_DoanhNghiep"
                    target="_blank"
                  >
                    <Box display={'flex'} alignItems={'center'}>
                      <Typography
                        ml={1}
                        fontSize={'14px'}
                        fontWeight={400}
                        color={theme.palette.common.black}
                      >
                        Tải template KHGD Doanh nghiệp
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
                  onClick={handleOpenDialog}
                >
                  <Link
                    style={{ color: 'transparent' }}
                    to={'/static/template/template_KHGD_CaNhan.xlsx'}
                    download="Template_KhachHangGiaoDich_CaNhan"
                    target="_blank"
                  >
                    <Box display={'flex'} alignItems={'center'}>
                      <Typography
                        ml={1}
                        fontSize={'14px'}
                        fontWeight={400}
                        color={theme.palette.common.black}
                      >
                        Tải template KHGD Cá nhân
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
                    onClick={downloadListCustomer}
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
        {customerManagerTrans?.data ? (
          <MaterialReactTable
            columns={
              checkPermissionExist(
                PermissionKeyEnum.CUSTOMER_APPRAISAL,
                userInfo,
              )
                ? columnsAppraisal
                : columns
            }
            data={customerManagerTrans?.data}
            manualPagination
            rowCount={customerManagerTrans?.total}
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
          />
        ) : (
          <p>No data available.</p>
        )}
      </Box>

      {isOpenDialogDetail && (
        <CustomerDetailDialog
          isOpen={isOpenDialogDetail}
          handleClose={handleCloseDialog}
          id={customerId}
        />
      )}
    </Paper>
  );
}
