import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import CustomButton from 'app/components/Button';
import { EllipsisText } from 'app/components/EllipsisText';
import RenderStatus from 'app/components/RenderStatus';
import { useSnackbarSlice } from 'app/components/Snackbar/slice';
import Table from 'app/components/Table';
import { useProfile } from 'app/hooks';
import { selectManagementInformation } from 'app/pages/ManagementInformation/slice/selectors';
import EditProcess from 'app/pages/ProcessManagement/edit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import palette from 'styles/theme/palette';
import { FilterParams, TableHeaderProps } from 'types';
import { PermissionKeyEnum } from 'types/Permission';
import { CanceledItem, CustomerInReservation } from 'types/Transaction';
import {
  checkPermissionExist,
  formatNumber,
  getLocalTime,
} from 'utils/helpers';
import { useManagementInformationActionsSlice } from 'app/pages/ManagementInformation/slice';
import SocketManager, { EventSocket } from 'app/components/Socket';
import { EventSocketListen, WorkFlowTypeEnum } from 'types/Enum';

import { useTransactionManagementSlice } from '../../slice';
import { selectTransactionManagement } from '../../slice/selector';
import BookingDetail from '../BookingDetail';

import {
  StatusTicketCanceled,
  StatusTicketReservation,
} from '../../slice/type';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StateLocationProps {
  tabActive: number | string;
  tickId: string;
}

export default function ListCanceled() {
  const { id } = useParams();
  const { actions } = useTransactionManagementSlice();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { actions: snackbarActions } = useSnackbarSlice();
  const { actions: projectSettingActions } =
    useManagementInformationActionsSlice();
  const { canceledManagement, isLoading, paramsSearch } = useSelector(
    selectTransactionManagement,
  );
  const [isRedirectToReceipt, setIsRedirectToReceipt] =
    useState<boolean>(false);
  const { workFlowInformation } = useSelector(selectManagementInformation);
  const { state } = useLocation();
  const locationProps = state as StateLocationProps;
  const [openBookingDetail, setOpenBookingDetail] = useState({
    isOpen: false,
    rowId: '',
  });
  const userInfo = useProfile();

  const header: TableHeaderProps[] = useMemo(
    () => [
      {
        id: 'code',
        label: 'Mã giữ chỗ',
        align: 'left',
        width: 200,
      },
      {
        id: 'id_payment',
        label: 'Mã thanh toán',
        align: 'left',
        width: 200,
      },
      {
        id: 'payment_count',
        label: 'Số tiền',
        align: 'left',
        width: 120,
      },
      {
        id: 'customer',
        label: 'Khách hàng',
        width: 200,
        align: 'left',
      },
      {
        id: 'phone_number',
        label: 'Điện thoại',
        width: 120,
        align: 'left',
      },
      {
        id: 'identity_card',
        label: 'CMND/CCCD',
        width: 150,
        align: 'left',
      },
      {
        id: 'exchanges',
        label: 'Đơn vị',
        width: 200,
        align: 'left',
      },
      {
        id: 'bussinesStaff',
        label: 'NV kinh doanh',
        width: 250,
        align: 'left',
      },
      {
        id: 'createAt',
        label: 'Thời gian',
        width: 200,
        align: 'left',
      },
      {
        id: 'status',
        label: 'Trạng thái',
        width: 200,
        align: 'left',
      },
    ],
    [],
  );

  const initialFilter = useMemo(() => {
    return {
      page: 1,
      limit: 20,
      checkStatus: true,
      status: 'CANCELED_TICKET',
      projectId: id,
    };
  }, [id]);
  const [filterParams, setFilterParams] = useState<FilterParams>(initialFilter);
  // const { filter, onFilterToQueryString } = useFilter({
  //   onFetchData: (params: FilterParams) => {
  //     fetchDataForPage(params);
  //   },
  //   defaultFilter: initialFilter,
  // });
  const fetchDataForPage = (params: FilterParams) => {
    dispatch(actions.fetchListCanceled(params));
  };

  useEffect(() => {
    if (locationProps && locationProps.tickId) {
      setIsRedirectToReceipt(true);
      setOpenBookingDetail({
        isOpen: true,
        rowId: locationProps.tickId,
      });
    }
  }, [locationProps]);

  useEffect(() => {
    if (paramsSearch) {
      setFilterParams({ ...filterParams, ...paramsSearch });
    }
  }, [paramsSearch]);

  useEffect(() => {
    if (id) {
      dispatch(
        projectSettingActions.fetchWorkFlowTree({
          id,
          type: WorkFlowTypeEnum.CANCELED_TICKET,
        }),
      );
    }
  }, [id]);

  useEffect(() => {
    fetchDataForPage(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  useEffect(() => {
    dispatch(actions.updateParamsSearch(initialFilter));
    return () => {
      dispatch(actions.clearListCanceled());
      // dispatch(actions.clearParamsSearch());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickReservationProcess = () => {
    if (workFlowInformation?.id) {
      setIsOpen(true);
    } else {
      dispatch(
        snackbarActions.updateSnackbar({
          message: 'Không xem được thiết lập dự án. Vui lòng kiểm tra lại!',
          type: 'error',
        }),
      );
    }
  };

  const TabPanel = (props: TabPanelProps) => {
    const { children, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      </div>
    );
  };

  const handleRequestSort = (event: any, property: string) => {
    setFilterParams({
      ...filterParams,
      sortByName: filterParams?.sortByName === 'true' ? 'false' : 'true',
    });
  };
  const onPageChange = (page: number) => {
    setFilterParams({
      ...filterParams,
      page,
    });
  };
  const handleSelectRow = (data: CanceledItem) => {
    setOpenBookingDetail({
      isOpen: true,
      rowId: data.id,
    });
  };
  const onPageSizeChange = (limit: number) => {
    setFilterParams({
      ...filterParams,
      page: 1,
      limit,
    });
  };

  const getStatusItem = (status: string) => {
    if (!status) return '';
    switch (status) {
      case StatusTicketReservation.CREATE_TICKET:
        return StatusTicketReservation.CREATE_TICKET;
      case StatusTicketReservation.APPROVED_TICKET:
        return StatusTicketReservation.APPROVED_TICKET;
      case StatusTicketReservation.WAIT_APPROVE_TICKET:
        return StatusTicketReservation.WAIT_APPROVE_TICKET;
      case StatusTicketReservation.REFUSE_TICKET:
        return StatusTicketReservation.REFUSE_TICKET;
      case StatusTicketCanceled.APPROVED_CANCELED:
        return StatusTicketCanceled.APPROVED_CANCELED;
      case StatusTicketCanceled.CREATE_CANCELED:
        return StatusTicketCanceled.CREATE_CANCELED;
      case StatusTicketCanceled.REFUSE_CANCELED:
        return StatusTicketCanceled.REFUSE_CANCELED;
      case StatusTicketCanceled.WAIT_APPROVE_CANCELED:
        return StatusTicketCanceled.WAIT_APPROVE_CANCELED;
      default:
        return '';
    }
  };

  const renderItem = (item: CanceledItem, index: number) => {
    const mainCustomerFilter = item?.customers?.filter(
      (customer: CustomerInReservation) => customer?.mainCustomer != null,
    );
    return [
      <EllipsisText
        text={`${item.code ?? ''}`}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          event.stopPropagation();
          if (
            checkPermissionExist(PermissionKeyEnum.TICKET_VIEW_ALL, userInfo) ||
            checkPermissionExist(PermissionKeyEnum.TICKET_APPROVE, userInfo) ||
            item?.user.id === userInfo?.id ||
            item?.staff.id === userInfo?.staff.id
          ) {
            handleSelectRow(item);
          } else return;
        }}
      />,
      <EllipsisText
        text={`${item?.refund?.code ?? ''}`}
        line={1}
        color={'#007AFF'}
        handleClick={event => {
          event.stopPropagation();
          // item?.code && handleSelectRow(item);
        }}
      />,
      <EllipsisText
        text={`${formatNumber(item?.refund?.amountPaid || 0) ?? ''}đ`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.name}`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.phoneNumber}`}
        line={1}
      />,
      <EllipsisText
        text={`${mainCustomerFilter?.[0]?.mainCustomer?.identityNumber}`}
        line={1}
      />,
      <EllipsisText text={`${item?.exchanges?.name}`} line={1} />,
      <EllipsisText text={`${item?.staff?.fullName || ''}`} line={1} />,
      <EllipsisText
        text={`${
          item.canceledAt
            ? getLocalTime(item?.canceledAt, 'HH:mm DD/MM/YYYY')
            : '-'
        }`}
        line={1}
      />,
      <RenderStatus
        isAsset
        status={
          getStatusItem(item.status) || StatusTicketReservation.CREATE_TICKET
        }
        pre_suf_fix={item.nodeName}
      />,
    ];
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const events: EventSocket[] = useMemo(
    () => [
      {
        name: EventSocketListen.UPDATE_TICKET_CANCEL,
        handler: (data: any) => {
          if (
            !data?.projectId ||
            (filterParams?.projectId &&
              data?.projectId === filterParams?.projectId)
          ) {
            fetchDataForPage(filterParams);
          }
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterParams],
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        overflow: 'hidden',
      }}
    >
      <SocketManager events={events} />
      <Box
        sx={{
          background: '#E0E1E4',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            background: '#475160',
            height: '40px',
            width: '141px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          <p>Phiếu hủy chỗ:</p>
          <p style={{ fontWeight: 700, marginLeft: '10px' }}>
            {canceledManagement?.totalStatistic ?? 0}
          </p>
        </Box>
        <CustomButton
          title="Quy trình duyệt hủy chỗ"
          variant="outlined"
          isIcon
          buttonMode="process"
          sxProps={{
            borderRadius: '0 20px 0 0',
            background: '#E0E1E4',
            color: palette.primary.button,
            height: '40px',
            borderColor: 'transparent',
          }}
          handleClick={handleClickReservationProcess}
          sxPropsText={{ fontSize: '14px' }}
        />
      </Box>
      {/* <TabPanel value={0} index={0}> */}
      <Box
        sx={{
          padding: '14px 16px 0px 16px',
        }}
      >
        <Table
          headers={header}
          onRequestSort={handleRequestSort}
          renderItem={renderItem}
          items={canceledManagement?.data}
          pageNumber={filterParams.page}
          totalElements={canceledManagement?.total}
          sort={filterParams.orderBy}
          limitElement={filterParams.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          // isLoading={isFetchListDepositLoading}
          isLoading={isLoading[actions.fetchListCanceled.type]}
          dataType={'DepositManagement'}
          // onSelectRow={handleSelectRow}
        />
      </Box>
      {/* </TabPanel> */}
      {openBookingDetail.isOpen && (
        <BookingDetail
          type="canceled"
          isRedirectToReceipt={isRedirectToReceipt}
          isOpen={openBookingDetail.isOpen}
          bookingId={openBookingDetail.rowId}
          filterParams={
            // { ...filter, status: 'CANCELED_TICKET', projectId: id }
            filterParams
          }
          onClose={() => {
            setOpenBookingDetail({
              isOpen: false,
              rowId: '',
            });
            setIsRedirectToReceipt(false);
          }}
        />
      )}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: '1000px' } }}
        maxWidth={'md'}
      >
        <Box sx={{ position: 'absolute', top: '14px', right: '16px' }}>
          <IconButton aria-label="delete" onClick={handleClose}>
            <CloseIcon
              sx={{ width: 26, height: 26, color: palette.button.greyLighter }}
            />
          </IconButton>
        </Box>
        <DialogTitle
          sx={{
            color: '#1E1E1E',
            fontSize: '24px !important',
            fontWeight: '700 !important',
            textAlign: 'center',
          }}
        >
          Quy trình duyệt hủy chỗ
        </DialogTitle>
        <EditProcess isEdit isShow idShow={workFlowInformation?.id} />
      </Dialog>
    </Paper>
  );
}
